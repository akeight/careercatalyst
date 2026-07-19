import { createHash } from "node:crypto";

export function hashJobDescription(text: string): string {
  return createHash("sha256").update(text.trim()).digest("hex");
}

export function buildIdempotencyKey(parts: {
  userId: string;
  applicationId: string;
  mode: string;
  jobDescriptionHash: string;
  roleFamily: string;
  schemaVersion: string;
}): string {
  const raw = [
    parts.userId,
    parts.applicationId,
    parts.mode,
    parts.jobDescriptionHash,
    parts.roleFamily,
    parts.schemaVersion,
  ].join("|");
  return createHash("sha256").update(raw).digest("hex");
}
