import { z } from "zod";

export const RecruiterSchema = z.object({
  name: z.string().min(1, "Recruiter name is required"),
  email: z.string().email("Invalid email").optional(),
  phone: z.string().optional(),
  linkedIn: z
    .string()
    .url("Must be a valid URL")
    .refine(
      (val) =>
        val.includes("linkedin.com/in/") || val.includes("linkedin.com/pub/"),
      { message: "Must be a valid LinkedIn profile URL" },
    )
    .optional(),
  role: z.string().optional(), // You could default to "Recruiter" in logic
});
