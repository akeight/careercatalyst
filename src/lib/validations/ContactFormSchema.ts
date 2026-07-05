import { z } from "zod";
import { ContactType } from "@prisma/client";
import { CreateCompanySchema } from "@/lib/validations/CreateCompanySchema";

export const ContactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.nativeEnum(ContactType).optional(),
  title: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  linkedIn: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  notes: z.string().max(1000).optional(),
  role: z.string().optional(),

  companyId: z.string().optional(), // selected from dropdown
  newCompany: CreateCompanySchema.optional(), // typed manually
});

export type ContactFormValues = z.infer<typeof ContactFormSchema>;
