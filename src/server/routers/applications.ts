import { z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { publicProcedure, router } from "../trpc";

// Zod schema for validation
const applicationSchema = z.object({
  position: z.string(),
  company: z.string(),
  status: z.enum(["APPLIED", "INTERVIEW", "OFFER", "REJECTED", "SAVED"]),
  link: z.string().optional(),
  notes: z.string().optional(),
  deadline: z.date().optional(),
  userId: z.string(),

  referredByRecruiter: z.boolean().optional(),
  recruiterName: z.string().optional(),
  recruiterLinkedIn: z
    .string()
    .url("Must be a valid URL")
    .refine((val) => val.includes("linkedin.com"), {
      message: "Must be a LinkedIn profile URL",
    })
    .optional(),
  recruiterEmail: z.string().email("Invalid email").optional(),
  recruiterPhone: z.string().optional(),
});

// Helper function for LinkedIn cleanup
const normalizeLinkedIn = (url?: string) => {
  if (!url) return undefined;
  const cleanUrl = new URL(url.split("?")[0].replace(/\/$/, ""));
  return cleanUrl.href;
};

// ✅ tRPC Router
export const applicationRouter = router({
  // Get all applications by userId
  getAll: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.application.findMany({
        where: { userId: input.userId },
        orderBy: { createdAt: "desc" },
      });
    }),

  // Create application
  create: publicProcedure
    .input(applicationSchema)
    .mutation(async ({ ctx, input }) => {
      const parsedPhone = input.recruiterPhone
        ? parsePhoneNumberFromString(
            input.recruiterPhone,
          )?.formatInternational()
        : undefined;

      const recruiterLinkedIn = normalizeLinkedIn(input.recruiterLinkedIn);

      return ctx.prisma.application.create({
        data: {
          ...input,
          recruiterPhone: parsedPhone,
          recruiterLinkedIn,
        },
      });
    }),

  // Update application
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        data: applicationSchema.partial(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { recruiterPhone, recruiterLinkedIn, ...rest } = input.data;

      const parsedPhone = recruiterPhone
        ? parsePhoneNumberFromString(recruiterPhone)?.formatInternational()
        : undefined;

      const cleanedLinkedIn = normalizeLinkedIn(recruiterLinkedIn);

      return ctx.prisma.application.update({
        where: { id: input.id },
        data: {
          ...rest,
          ...(recruiterPhone !== undefined && { recruiterPhone: parsedPhone }),
          ...(recruiterLinkedIn !== undefined && {
            recruiterLinkedIn: cleanedLinkedIn,
          }),
        },
      });
    }),

  // Delete application
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.application.delete({
        where: { id: input.id },
      });
    }),
});
