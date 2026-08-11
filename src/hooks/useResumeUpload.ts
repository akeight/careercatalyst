"use client";

import { useState } from "react";
import { upload } from "@vercel/blob/client";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { trpc } from "@/lib/trpc/client";
import {
  RESUME_ALLOWED_CONTENT_TYPES,
  RESUME_MAX_BYTES,
  resumePathPrefix,
} from "@/lib/storage/resumeConstants";

export type UploadedResume = {
  id: string;
  label: string | null;
  fileName: string;
  size: number | null;
};

/**
 * Client-side resume upload: uploads the PDF directly to the private Blob store
 * via the handleUpload token route, then persists metadata through tRPC.
 * Returns the created resume, or null on failure.
 */
export function useResumeUpload() {
  const { data: session } = useSession();
  const utils = trpc.useUtils();
  const createResume = trpc.resume.create.useMutation();
  const [uploading, setUploading] = useState(false);

  const uploadResume = async (
    file: File,
    label?: string,
  ): Promise<UploadedResume | null> => {
    const userId = session?.user?.id;

    if (!userId) {
      toast.error("You must be signed in to upload a resume.");
      return null;
    }

    if (session?.user?.isDemo) {
      toast.error("Resume upload is not available in demo mode.");
      return null;
    }

    if (
      !RESUME_ALLOWED_CONTENT_TYPES.includes(file.type as "application/pdf")
    ) {
      toast.error("Please upload a PDF file.");
      return null;
    }

    if (file.size > RESUME_MAX_BYTES) {
      toast.error("File is too large (max 8 MB).");
      return null;
    }

    setUploading(true);
    try {
      const blob = await upload(
        `${resumePathPrefix(userId)}${file.name}`,
        file,
        {
          access: "private",
          handleUploadUrl: "/api/resume/upload",
          contentType: "application/pdf",
        },
      );

      const created = await createResume.mutateAsync({
        url: blob.url,
        pathname: blob.pathname,
        fileName: file.name,
        label: label?.trim() || undefined,
        size: file.size,
      });

      await utils.resume.list.invalidate();
      toast.success("Resume uploaded!");
      return created;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.");
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadResume, uploading };
}
