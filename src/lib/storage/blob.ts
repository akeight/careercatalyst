import { del, issueSignedToken, presignUrl } from "@vercel/blob";

export {
  RESUME_MAX_BYTES,
  RESUME_ALLOWED_CONTENT_TYPES,
  RESUME_PATH_PREFIX,
  resumePathPrefix,
  isOwnedResumePathname,
} from "./resumeConstants";

/**
 * Server-only storage abstraction around Vercel Blob so the provider stays
 * swappable (e.g. Cloudflare R2 later) behind this one module.
 *
 * Resumes contain PII, so they live in a PRIVATE Blob store: files are never
 * publicly readable and are served via short-lived signed URLs minted after an
 * auth + ownership check.
 */

/** Signed view URLs are valid for 5 minutes. */
const SIGNED_URL_TTL_MS = 5 * 60 * 1000;

export function isBlobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

/**
 * Mint a short-lived signed GET URL for a private resume blob. Callers MUST
 * verify ownership before calling this.
 */
export async function getSignedResumeUrl(pathname: string): Promise<string> {
  const validUntil = Date.now() + SIGNED_URL_TTL_MS;

  // Sign with the read-write token explicitly. Without it, the SDK falls back
  // to Vercel OIDC, which is only injected in deployed environments — so local
  // `next dev` throws "OIDC is enabled for this project, but not for the
  // development environment". The token stays server-side; only the resulting
  // short-lived signed GET URL is handed to the client.
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

  const token = await issueSignedToken({
    pathname,
    operations: ["get"],
    validUntil,
    token: blobToken,
  });

  // presignUrl only builds the URL from the already-issued token material; it
  // takes no read-write token (auth happened in issueSignedToken above).
  const { presignedUrl } = await presignUrl(token, {
    operation: "get",
    pathname,
    access: "private",
    validUntil,
  });

  return presignedUrl;
}

/**
 * Delete a resume blob from storage. Accepts either a pathname or a full URL.
 * No-ops when nothing is provided so it's safe to call during cleanup.
 */
export async function deleteResumeBlob(
  pathnameOrUrl: string | null | undefined,
): Promise<void> {
  if (!pathnameOrUrl) return;
  await del(pathnameOrUrl);
}
