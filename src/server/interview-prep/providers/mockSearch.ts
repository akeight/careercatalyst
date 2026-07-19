import type { SearchProvider, SearchResult } from "./types";

export function createMockSearchProvider(
  results: SearchResult[] = [],
): SearchProvider {
  return {
    name: "mock-search",
    async search(query, opts) {
      const max = opts?.maxResults ?? 5;
      if (results.length) return results.slice(0, max);
      return [
        {
          url: "https://example.com/about",
          title: `About (${query})`,
          content:
            "Example Corp builds developer tools for students. Mission: help people land careers.",
          score: 0.9,
        },
        {
          url: "https://example.com/careers",
          title: "Careers",
          content:
            "We hire software engineers and value collaboration, reliability, and learning.",
          score: 0.8,
        },
      ].slice(0, max);
    },
  };
}
