import { z } from "zod";

export const GoalSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(1000).optional().or(z.literal("")),
  targetDate: z.string().optional().or(z.literal("")),
});

export type GoalValues = z.infer<typeof GoalSchema>;
