import { z } from "zod";

const envSchema = z.object({
  INTERVIEW_PREP_ENABLED: z
    .string()
    .optional()
    .transform((v) => v === "true" || v === "1"),
  OPENAI_API_KEY: z.string().optional(),
  TAVILY_API_KEY: z.string().optional(),
  DATABASE_URL: z.string().optional(),
  NEXTAUTH_SECRET: z.string().optional(),
});

export type AppEnv = z.infer<typeof envSchema>;

let cached: AppEnv | null = null;

export function getEnv(): AppEnv {
  if (cached) return cached;
  cached = envSchema.parse({
    INTERVIEW_PREP_ENABLED: process.env.INTERVIEW_PREP_ENABLED,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    TAVILY_API_KEY: process.env.TAVILY_API_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  });
  return cached;
}

export function isInterviewPrepEnabled(): boolean {
  return getEnv().INTERVIEW_PREP_ENABLED === true;
}
