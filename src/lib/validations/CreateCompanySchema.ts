// /lib/validations/CompanySchema.ts
import { z } from "zod";

export const CreateCompanySchema = z.object({
  name: z.string().min(1),
  website: z.string().optional(),
});
