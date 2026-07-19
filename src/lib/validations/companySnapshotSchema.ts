import { z } from "zod";
import { ROLE_FAMILY_VALUES } from "@/lib/roleFamily";

export const SNAPSHOT_SCHEMA_VERSION = "1.0.0";

export const evidenceStatusSchema = z.enum([
  "verified",
  "inferred",
  "unknown",
  "conflicting",
]);

/** No `.default()` / `.optional()` — OpenAI structured outputs require every key in `required`. */
export const claimedTextSchema = z.object({
  text: z.string(),
  evidenceStatus: evidenceStatusSchema,
  sourceIds: z.array(z.string()),
});

export const companySnapshotSchema = z.object({
  quickCompanySummary: claimedTextSchema,
  productsAndServices: z.array(claimedTextSchema),
  usersOrCustomers: z.array(claimedTextSchema),
  missionAndValues: z.array(claimedTextSchema),
  industryContext: claimedTextSchema.nullable(),
  basicRoleSummary: claimedTextSchema,
  roleFamily: z.enum(ROLE_FAMILY_VALUES),
  keyThingsToKnow: z.array(claimedTextSchema),
  researchGaps: z.object({
    informationNotFound: z.array(z.string()),
    conflictingInformation: z.array(z.string()),
    unverifiableClaims: z.array(z.string()),
    missingUserContext: z.array(z.string()),
    suggestedManualInputs: z.array(z.string()),
  }),
});

export type CompanySnapshot = z.infer<typeof companySnapshotSchema>;
