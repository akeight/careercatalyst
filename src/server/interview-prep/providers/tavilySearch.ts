import type { SearchProvider, SearchResult } from "./types";

export function createTavilySearchProvider(apiKey: string): SearchProvider {
  return {
    name: "tavily",
    async search(query, opts) {
      const maxResults = opts?.maxResults ?? 5;
      const searchDepth = opts?.searchDepth ?? "basic";
      const res = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: apiKey,
          query,
          max_results: maxResults,
          include_answer: false,
          search_depth: searchDepth,
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(
          `Tavily search failed: ${res.status} ${text.slice(0, 200)}`,
        );
      }

      const data = (await res.json()) as {
        results?: Array<{
          url?: string;
          title?: string;
          content?: string;
          score?: number;
          published_date?: string;
        }>;
      };

      const results: SearchResult[] = (data.results ?? [])
        .filter((r) => r.url)
        .map((r) => ({
          url: r.url!,
          title: r.title ?? r.url!,
          content: (r.content ?? "").slice(0, 6000),
          score: r.score,
          publishedDate: r.published_date ?? null,
        }));

      return results;
    },
  };
}
