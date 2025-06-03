"use client";

import { z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { router } from "../trpc";
import { protectedProcedure } from "../trpc";

// Zod schema for validation
export const applicationSchema = z.object({
  companyId: z.string(),
  title: z.string(),
  type: z.enum(["INTERNSHIP", "FELLOWSHIP", "EARLY_CAREER"]),
  status: z.enum(["APPLIED", "INTERVIEW", "OFFER", "REJECTED", "SAVED"]),
  location: z.string().optional(),
  source: z.string().optional(),
  deadline: z.date().optional(),

  referredByRecruiter: z.boolean().optional(),
  recruiterName: z.string().optional(),
  recruiterEmail: z.string().email().optional(),
  recruiterPhone: z.string().optional(),
  recruiterLinkedIn: z
    .string()
    .optional()
    .refine((val) => !val || val.includes("linkedin.com"), {
      message: "Must be a LinkedIn profile URL",
    }),
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
  getAll: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.application.findMany({
        where: { userId: input.userId },
        include: {
          company: true,
          contact: true,
        },
        orderBy: { createdAt: "desc" },
      });
    }),

  // Create application
  create: protectedProcedure
    .input(applicationSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      let contactId: string | undefined;

      // Optional: Create contact if referred
      if (input.referredByRecruiter && input.recruiterName) {
        const parsedPhone = input.recruiterPhone
          ? parsePhoneNumberFromString(
              input.recruiterPhone,
            )?.formatInternational()
          : undefined;

        const cleanedLinkedIn = input.recruiterLinkedIn
          ? normalizeLinkedIn(input.recruiterLinkedIn)
          : undefined;

        const contact = await ctx.prisma.contact.create({
          data: {
            name: input.recruiterName,
            email: input.recruiterEmail,
            phone: parsedPhone,
            linkedIn: cleanedLinkedIn,
            role: "Recruiter",
            companyId: input.companyId,
          },
        });

        contactId = contact.id;
      }

      // Create the application
      return ctx.prisma.application.create({
        data: {
          userId,
          companyId: input.companyId,
          title: input.title,
          type: input.type,
          status: input.status,
          location: input.location,
          source: input.source,
          deadline: input.deadline,
          contactId, // optional, only added if defined
        },
      });
    }),

  // Update application
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: applicationSchema.partial(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const {
        recruiterPhone,
        recruiterLinkedIn,
        recruiterName,
        recruiterEmail,
        referredByRecruiter,
        ...rest
      } = input.data;

      const parsedPhone = recruiterPhone
        ? parsePhoneNumberFromString(recruiterPhone)?.formatInternational()
        : undefined;

      const cleanedLinkedIn = recruiterLinkedIn
        ? normalizeLinkedIn(recruiterLinkedIn)
        : undefined;

      // Get the existing application and contact
      const existing = await ctx.prisma.application.findUnique({
        where: { id: input.id },
        include: { contact: true },
      });

      let contactUpdate = {};

      // ✅ CASE 1: Recruiter *is* still checked
      if (referredByRecruiter && existing?.contactId) {
        await ctx.prisma.contact.update({
          where: { id: existing.contactId },
          data: {
            name: recruiterName ?? undefined,
            email: recruiterEmail ?? undefined,
            phone: parsedPhone,
            linkedIn: cleanedLinkedIn,
          },
        });
      }

      // ❌ CASE 2: Recruiter was *unchecked* — remove contact link
      if (referredByRecruiter === false && existing?.contactId) {
        // Optionally delete contact if it's safe to do so
        await ctx.prisma.contact.delete({
          where: { id: existing.contactId },
        });

        contactUpdate = {
          contact: { disconnect: true },
        };
      }

      // ✅ Update the application itself
      return ctx.prisma.application.update({
        where: { id: input.id },
        data: {
          ...rest,
          ...contactUpdate,
        },
      });
    }),

  // Delete application
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.application.delete({
        where: { id: input.id },
      });
    }),
});
