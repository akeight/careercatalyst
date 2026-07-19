export type SearchResult = {
  url: string;
  title: string;
  content: string;
  score?: number;
  publishedDate?: string | null;
};

export type SearchOpts = {
  maxResults?: number;
  searchDepth?: "basic" | "advanced";
};

export type SearchProvider = {
  name: string;
  search: (query: string, opts?: SearchOpts) => Promise<SearchResult[]>;
};

export type LlmProvider = {
  name: string;
  generateObject: <T>(args: {
    system: string;
    prompt: string;
    schema: import("zod").ZodType<T>;
    maxTokens?: number;
    kind?: "snapshot" | "brief" | "role-depth";
  }) => Promise<{
    object: T;
    usage?: { inputTokens?: number; outputTokens?: number };
  }>;
};
