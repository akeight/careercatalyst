import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import type { z } from "zod";
import type { LlmProvider } from "./types";

export function createOpenAiLlmProvider(apiKey: string): LlmProvider {
  const openai = createOpenAI({ apiKey });

  return {
    name: "openai",
    async generateObject({ system, prompt, schema, maxTokens }) {
      const result = await generateObject({
        model: openai("gpt-4o-mini"),
        system,
        prompt,
        // AI SDK accepts Zod schemas; cast keeps our generic provider surface simple.
        schema: schema as z.ZodTypeAny,
        maxOutputTokens: maxTokens,
      });

      return {
        object: result.object as never,
        usage: {
          inputTokens: result.usage?.inputTokens,
          outputTokens: result.usage?.outputTokens,
        },
      };
    },
  };
}
