import { z } from "zod";
import { Status } from "@prisma/client";

export const EditApplicationSchema = z.object({
  type: z.enum(["INTERNSHIP", "FELLOWSHIP", "EARLY_CAREER"]),
  company: z.object({
    id: z.string().optional(), // new companies won't have this yet
    name: z.string(),
  }),
  title: z.string().min(1, "Position is required"),
  status: z.nativeEnum(Status),
  location: z.string().optional(),
  link: z.string().url("Must be a valid URL").optional(),
  notes: z.string().max(1000).optional(),
  deadline: z.coerce.date().optional(), // optional and coerces from strings if present
  contactId: z.string().optional(),
  referredByRecruiter: z.boolean().optional(),
  recruiterName: z.string().optional(),
  recruiterLinkedIn: z.string().url("Invalid LinkedIn URL").optional(),
  recruiterEmail: z.string().email("Invalid email").optional(),
  recruiterPhone: z.string().optional(), // we'll validate this more later if needed
  favorite: z.boolean().optional(),
  source: z.string().optional(),
});
