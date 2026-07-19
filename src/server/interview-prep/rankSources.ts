import type { ResearchMode } from "./limits";
import { RESEARCH_LIMITS } from "./limits";
import {
  classifyEvidenceTier,
  classifyContentSourceType,
  isNewsOrBlogSourceType,
  normalizeUrl,
  assertSafeUrl,
  type ContentSourceType,
} from "./urlSafety";
import type { SearchResult } from "./providers/types";

export type RankedSource = {
  url: string;
  normalizedUrl: string;
  title: string;
  excerpt: string;
  evidenceTier: "PRIMARY" | "CREDIBLE_SECONDARY" | "ANECDOTAL";
  relevanceScore: number;
  publishedDate?: string | null;
  sourceType: ContentSourceType | string;
};

function scoreSource(
  result: SearchResult,
  tier: RankedSource["evidenceTier"],
  sourceType: ContentSourceType,
  companyDomain?: string | null,
): number {
  let score = result.score ?? 0.5;
  if (tier === "PRIMARY") score += 0.35;
  if (tier === "CREDIBLE_SECONDARY") score += 0.15;
  if (tier === "ANECDOTAL") score -= 0.2;

  if (sourceType === "NEWSROOM") score += 0.25;
  if (sourceType === "ENGINEERING_BLOG") score += 0.28;

  if (companyDomain) {
    const domain = companyDomain.replace(/^www\./, "").toLowerCase();
    try {
      const host = new URL(result.url).hostname
        .replace(/^www\./, "")
        .toLowerCase();
      if (
        (host === domain || host.endsWith(`.${domain}`)) &&
        isNewsOrBlogSourceType(sourceType)
      ) {
        score += 0.15;
      }
    } catch {
      /* ignore */
    }
  }

  return score;
}

/**
 * Rank candidates and, for Brief mode, reserve slots for newsroom/blog sources.
 */
export function rankAndSelectSources(args: {
  results: SearchResult[];
  mode: ResearchMode;
  companyDomain?: string | null;
  maxSources: number;
  maxExtractChars?: number;
}): RankedSource[] {
  const {
    results,
    mode,
    companyDomain,
    maxSources,
    maxExtractChars = mode === "INTERVIEW_BRIEF" ? 6000 : 4000,
  } = args;
  const seen = new Set<string>();
  const ranked: RankedSource[] = [];

  for (const result of results) {
    const safety = assertSafeUrl(result.url);
    if (!safety.ok) continue;
    const normalized = normalizeUrl(result.url);
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);

    const tier = classifyEvidenceTier(result.url, companyDomain);
    if (mode === "SNAPSHOT" && tier === "ANECDOTAL") continue;

    const sourceType = classifyContentSourceType(result.url);
    const score = scoreSource(result, tier, sourceType, companyDomain);

    ranked.push({
      url: result.url,
      normalizedUrl: normalized,
      title: result.title,
      excerpt: result.content.slice(0, maxExtractChars),
      evidenceTier: tier,
      relevanceScore: score,
      publishedDate: result.publishedDate,
      sourceType,
    });
  }

  ranked.sort((a, b) => b.relevanceScore - a.relevanceScore);

  if (mode !== "INTERVIEW_BRIEF" || maxSources <= 0) {
    return ranked.slice(0, maxSources);
  }

  const minNews = Math.min(RESEARCH_LIMITS.minNewsBlogSlots, maxSources);
  const newsBlog = ranked.filter((s) => isNewsOrBlogSourceType(s.sourceType));
  const rest = ranked.filter((s) => !isNewsOrBlogSourceType(s.sourceType));

  const reserved = newsBlog.slice(0, minNews);
  const reservedUrls = new Set(reserved.map((s) => s.normalizedUrl));
  const remainingSlots = maxSources - reserved.length;
  const fillers = [...newsBlog.slice(minNews), ...rest]
    .filter((s) => !reservedUrls.has(s.normalizedUrl))
    .slice(0, remainingSlots);

  return [...reserved, ...fillers];
}
