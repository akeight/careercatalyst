// src/lib/validations/applicationFormSchema.ts

import { z } from "zod";

export const AddApplicationSchema = z.object({
  type: z.enum(["INTERNSHIP", "FELLOWSHIP", "EARLY_CAREER"]),
  company: z.object({
    id: z.string().optional(), // new companies won't have this yet
    name: z.string(),
  }),
  title: z.string().min(1, "Position is required"),
  status: z.enum(["SAVED", "APPLIED"], {
    message: "Choose saved or applied",
  }),
  contactId: z.string().optional(),
  location: z.string().optional(),
  link: z.string().url("Must be a valid URL").optional(),
  notes: z.string().max(1000).optional(),
  favorite: z.boolean().optional(),
  source: z.string().optional(),

  referredByRecruiter: z.boolean().optional(),
  recruiterName: z.string().optional(),
  recruiterLinkedIn: z
    .string()
    .url("Must be a valid URL")
    .refine(
      (val) =>
        val.includes("linkedin.com/in/") || val.includes("linkedin.com/pub/"),
      {
        message: "Must be a valid LinkedIn profile URL",
      },
    )
    .optional(),
  recruiterEmail: z.string().email("Invalid email").optional(),
  recruiterPhone: z.string().optional(), // we'll validate this more later if needed
});
