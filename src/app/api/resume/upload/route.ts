import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

import { auth } from "@/server/auth";
import { rateLimit } from "@/lib/rateLimit";
import {
  RESUME_ALLOWED_CONTENT_TYPES,
  RESUME_MAX_BYTES,
  isBlobConfigured,
  isOwnedResumePathname,
} from "@/lib/storage/blob";

// Allow up to 10 upload-token requests per user per minute.
const UPLOAD_RATE_LIMIT = 10;
const UPLOAD_RATE_WINDOW_MS = 60 * 1000;

export async function POST(request: Request): Promise<NextResponse> {
  if (!isBlobConfigured()) {
    // Surfaces in Vercel Runtime Logs so a missing Production env var is obvious.
    console.error(
      "[resume/upload] BLOB_READ_WRITE_TOKEN is missing from this runtime.",
    );
    return NextResponse.json(
      { error: "Resume storage is not configured." },
      { status: 503 },
    );
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        const session = await auth();

        if (!session?.user?.id) {
          throw new Error("Unauthorized");
        }

        if (session.user.isDemo) {
          throw new Error("Resume upload is not available in demo mode.");
        }

        const { success } = rateLimit(
          `resume-upload:${session.user.id}`,
          UPLOAD_RATE_LIMIT,
          UPLOAD_RATE_WINDOW_MS,
        );
        if (!success) {
          throw new Error("Too many uploads. Please try again in a minute.");
        }

        // Enforce that the client can only write into its own resume folder.
        if (!isOwnedResumePathname(pathname, session.user.id)) {
          throw new Error("Invalid upload path.");
        }

        return {
          allowedContentTypes: [...RESUME_ALLOWED_CONTENT_TYPES],
          maximumSizeInBytes: RESUME_MAX_BYTES,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ userId: session.user.id }),
        };
      },
      // Doesn't fire on localhost; metadata is persisted client-side via the
      // resume.create tRPC mutation after upload() resolves.
      onUploadCompleted: async () => {},
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("[resume/upload] token generation failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed." },
      { status: 400 },
    );
  }
}
