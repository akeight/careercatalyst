// src/lib/validations/applicationFormSchema.ts

import { z } from "zod";
import { RecruiterSchema } from "@/lib/validations/ContactSchema";
import { CreateCompanySchema } from "@/lib/validations/CreateCompanySchema";

export const AddApplicationSchema = z.object({
  type: z.enum(["INTERNSHIP", "FELLOWSHIP", "EARLY_CAREER"]),
  title: z.string().min(1, "Position is required"),
  status: z.enum(["SAVED", "APPLIED"], {
    message: "Choose saved or applied",
  }),
  location: z.string().optional(),
  link: z.string().url("Must be a valid URL").optional(),
  notes: z.string().max(1000).optional(),
  deadline: z.date().optional(),
  favorite: z.boolean().optional(),
  source: z.string().optional(),
  userId: z.string().optional(),

  companyId: z.string().optional(), // selected from dropdown
  newCompany: CreateCompanySchema.optional(), // typed manually

  referredByRecruiter: z.boolean().optional(),
  recruiter: RecruiterSchema.optional(),
  recruiterName: z.string().optional(),
});
