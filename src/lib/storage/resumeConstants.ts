/**
 * Pure, client-safe resume storage constants and helpers. Kept separate from
 * `blob.ts` so importing them into client components does not bundle the
 * server-only `@vercel/blob` SDK.
 */

export const RESUME_MAX_BYTES = 8 * 1024 * 1024; // 8 MB
export const RESUME_ALLOWED_CONTENT_TYPES = ["application/pdf"] as const;
export const RESUME_PATH_PREFIX = "resumes";

/** Root path that scopes a user's resume blobs, e.g. `resumes/{userId}/`. */
export function resumePathPrefix(userId: string): string {
  return `${RESUME_PATH_PREFIX}/${userId}/`;
}

/** True when a blob pathname belongs to the given user's resume folder. */
export function isOwnedResumePathname(
  pathname: string | null | undefined,
  userId: string,
): boolean {
  if (!pathname) return false;
  return pathname.startsWith(resumePathPrefix(userId));
}
