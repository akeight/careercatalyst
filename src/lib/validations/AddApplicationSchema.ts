// src/lib/validations/applicationFormSchema.ts

import { z } from "zod";
import { STATUS_VALUES } from "@/lib/status";
import { RecruiterSchema } from "@/lib/validations/ContactSchema";
import { CreateCompanySchema } from "@/lib/validations/CreateCompanySchema";
import {
  MOBILE_SPECIALIZATION_VALUES,
  ROLE_FAMILY_VALUES,
} from "@/lib/roleFamily";

const addApplicationFields = {
  type: z.enum(["INTERNSHIP", "FELLOWSHIP", "EARLY_CAREER"]),
  title: z.string().min(1, "Position is required"),
  status: z.enum(STATUS_VALUES),
  location: z.string().optional(),
  jobUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  jobDescription: z
    .string()
    .max(20000, "Job description must be 20000 characters or fewer")
    .optional()
    .or(z.literal("")),
  roleFamily: z.enum(ROLE_FAMILY_VALUES).optional().nullable(),
  mobileSpecialization: z
    .enum(MOBILE_SPECIALIZATION_VALUES)
    .optional()
    .nullable(),
  notes: z
    .string()
    .max(4000, "Notes must be 4000 characters or fewer")
    .optional(),
  deadline: z.date().optional(),
  favorite: z.boolean().optional(),
  source: z.string().optional(),
  userId: z.string().optional(),

  companyId: z.string().optional(),
  newCompany: CreateCompanySchema.optional(),

  contactId: z.string().optional(),
  referredByRecruiter: z.boolean().optional(),
  recruiter: RecruiterSchema.optional(),
};

function refineMobileSpecialization(
  data: {
    roleFamily?: string | null;
    mobileSpecialization?: string | null;
  },
  ctx: z.RefinementCtx,
) {
  if (
    data.roleFamily &&
    data.roleFamily !== "MOBILE_DEVELOPMENT" &&
    data.mobileSpecialization
  ) {
    ctx.addIssue({
      code: "custom",
      message: "Mobile specialization only applies to Mobile Development",
      path: ["mobileSpecialization"],
    });
  }
}

export const AddApplicationObjectSchema = z.object(addApplicationFields);

export const AddApplicationSchema = z
  .object(addApplicationFields)
  .superRefine(refineMobileSpecialization);

/** Partial update input — separate object so refinements never block `.partial()`. */
export const UpdateApplicationDataSchema = z
  .object(addApplicationFields)
  .partial()
  .superRefine(refineMobileSpecialization);

export const JOB_DESCRIPTION_MIN_FOR_RESEARCH = 50;
