export type ResearchMode = "SNAPSHOT" | "INTERVIEW_BRIEF";

export const RESEARCH_LIMITS = {
  SNAPSHOT: {
    maxSearches: 4,
    maxSources: 6,
    maxExtractChars: 4000,
    maxOutputTokens: 2500,
    maxResultsPerSearch: 5,
    searchDepth: "basic" as const,
    digestCharsPerSource: 1200,
  },
  INTERVIEW_BRIEF: {
    maxSearches: 10,
    maxSources: 14,
    maxExtractChars: 6000,
    maxOutputTokens: 8000,
    maxResultsPerSearch: 8,
    searchDepth: "advanced" as const,
    digestCharsPerSource: 3500,
  },
  maxRunsPerUserPerDay: 20,
  stuckRunMinutes: 15,
  briefStaleDays: 14,
  snapshotStaleDays: 28,
  maxRetries: 1,
  /** Cap About/Careers-style Snapshot sources reused into a Brief. */
  maxReusableGeneralSources: 4,
  /** Prefer at least this many newsroom/blog sources in Brief when available. */
  minNewsBlogSlots: 3,
} as const;

export function getLimitsForMode(mode: ResearchMode) {
  return RESEARCH_LIMITS[mode];
}
