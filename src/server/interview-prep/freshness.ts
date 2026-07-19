import { RESEARCH_LIMITS } from "./limits";

export function isStale(
  generatedAt: Date | null | undefined,
  staleDays: number,
): boolean {
  if (!generatedAt) return false;
  const ageMs = Date.now() - generatedAt.getTime();
  return ageMs > staleDays * 24 * 60 * 60 * 1000;
}

export function snapshotStaleReason(
  generatedAt: Date | null | undefined,
  jobHashChanged: boolean,
): string | null {
  if (jobHashChanged) return "JOB_DESCRIPTION_CHANGED";
  if (isStale(generatedAt, RESEARCH_LIMITS.snapshotStaleDays)) {
    return "AGE";
  }
  return null;
}

export function briefStaleReason(
  generatedAt: Date | null | undefined,
  jobHashChanged: boolean,
): string | null {
  if (jobHashChanged) return "JOB_DESCRIPTION_CHANGED";
  if (isStale(generatedAt, RESEARCH_LIMITS.briefStaleDays)) {
    return "AGE";
  }
  return null;
}

export function isSourceReusable(args: {
  accessedAt: Date;
  evidenceTier: string;
  sourceType: string;
  maxAgeDays?: number;
}): boolean {
  const maxAge = args.maxAgeDays ?? 28;
  if (args.sourceType === "NEWS" || args.sourceType.includes("NEWS")) {
    return !isStale(args.accessedAt, 7);
  }
  return !isStale(args.accessedAt, maxAge);
}
