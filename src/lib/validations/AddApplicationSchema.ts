// src/lib/validations/applicationFormSchema.ts

import { z } from "zod";
import { Status } from "@prisma/client";
import { RecruiterSchema } from "@/lib/validations/ContactSchema";
import { CreateCompanySchema } from "@/lib/validations/CreateCompanySchema";

export const AddApplicationSchema = z.object({
  type: z.enum(["INTERNSHIP", "FELLOWSHIP", "EARLY_CAREER"]),
  title: z.string().min(1, "Position is required"),
  status: z.nativeEnum(Status),
  location: z.string().optional(),
  jobUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  notes: z
    .string()
    .max(4000, "Notes must be 4000 characters or fewer")
    .optional(),
  deadline: z.coerce.date().optional(),
  favorite: z.boolean().optional(),
  source: z.string().optional(),
  userId: z.string().optional(),

  companyId: z.string().optional(), // selected from dropdown
  newCompany: CreateCompanySchema.optional(), // typed manually

  referredByRecruiter: z.boolean().optional(),
  recruiter: RecruiterSchema.optional(),
  recruiterName: z.string().optional(),
});
