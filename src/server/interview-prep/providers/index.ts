import { getEnv } from "@/lib/env";
import { createMockLlmProvider } from "./mockLlm";
import { createMockSearchProvider } from "./mockSearch";
import { createOpenAiLlmProvider } from "./openaiLlm";
import { createTavilySearchProvider } from "./tavilySearch";
import type { LlmProvider, SearchProvider } from "./types";

export function getSearchProvider(): SearchProvider {
  const env = getEnv();
  if (env.TAVILY_API_KEY) {
    return createTavilySearchProvider(env.TAVILY_API_KEY);
  }
  return createMockSearchProvider();
}

export function getLlmProvider(): LlmProvider {
  const env = getEnv();
  if (env.OPENAI_API_KEY) {
    return createOpenAiLlmProvider(env.OPENAI_API_KEY);
  }
  return createMockLlmProvider();
}
