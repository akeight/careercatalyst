// src/lib/validations/applicationFormSchema.ts

import { z } from "zod";
import { Status } from "@prisma/client";

export const AddApplicationSchema = z.object({
  company: z.string().min(1, "Company is required"),
  position: z.string().min(1, "Position is required"),
  status: z
    .nativeEnum(Status)
    .refine((val) => val === "SAVED" || val === "APPLIED", {
      message: "Choose saved or applied",
    }),
  location: z.string().optional(),
  link: z.string().url("Must be a valid URL").optional(),
  notes: z.string().max(1000).optional(),

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
