import { z } from "zod";

const optionalUrl = z
  .string()
  .url("Must be a valid URL")
  .optional()
  .or(z.literal(""));

const currentYear = new Date().getFullYear();

export const ProfileSchema = z.object({
  school: z.string().max(120).optional().or(z.literal("")),
  major: z.string().max(120).optional().or(z.literal("")),
  gradYear: z
    .number()
    .int()
    .min(1950, "Enter a valid year")
    .max(currentYear + 10, "Enter a valid year")
    .optional()
    .nullable(),
  targetRole: z.string().max(120).optional().or(z.literal("")),

  linkedInUrl: optionalUrl,
  githubUrl: optionalUrl,
  portfolioUrl: optionalUrl,

  weeklyGoal: z
    .number()
    .int()
    .min(1, "Set a goal of at least 1")
    .max(50, "Keep it under 50"),
});

export type ProfileValues = z.infer<typeof ProfileSchema>;

// Used by the onboarding flow. Same shape, all fields optional so users can
// skip steps, but weeklyGoal keeps a sensible default at the boundary.
export const OnboardingSchema = ProfileSchema.partial();

export type OnboardingValues = z.infer<typeof OnboardingSchema>;
