import { z } from "zod";
import { Status } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../trpc";
import { AddApplicationSchema } from "@/lib/validations/AddApplicationSchema";
import { normalizeLinkedIn } from "@/lib/utils/normalizeLinkedIn";
import type { Context } from "@/server/context";

const applicationInclude = {
  company: true,
  contact: {
    include: {
      company: true,
    },
  },
};

async function getOwnedContactId({
  contactId,
  userId,
  prisma,
  linkedContactId,
}: {
  contactId?: string | null;
  userId: string;
  prisma: Context["prisma"];
  linkedContactId?: string | null;
}) {
  if (!contactId) return undefined;

  const ownedContact = await prisma.contact.findFirst({
    where: { id: contactId, userId },
    select: { id: true },
  });

  if (ownedContact) return ownedContact.id;

  // Allow re-saving a contact already linked to this application.
  if (linkedContactId === contactId) {
    const linkedContact = await prisma.contact.findFirst({
      where: { id: contactId },
      select: { id: true },
    });
    if (linkedContact) return linkedContact.id;
  }

  throw new TRPCError({ code: "NOT_FOUND", message: "Contact not found" });
}

export const applicationRouter = router({
  // 🔍 Get all applications for user
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.application.findMany({
      where: { userId: ctx.session.user.id },
      include: applicationInclude,
    });
  }),

  // 🌟 Get favorites
  getFavorites: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.application.findMany({
      where: {
        userId: ctx.session.user.id,
        favorite: true,
      },
      include: applicationInclude,
    });
  }),

  // 🔖 Get saved internships
  getSaved: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.application.findMany({
      where: {
        userId: ctx.session.user.id,
        status: "SAVED",
      },
      include: applicationInclude,
    });
  }),

  // 📊 Aggregated counts by status (for dashboard stat cards + pie chart)
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const grouped = await ctx.prisma.application.groupBy({
      by: ["status"],
      where: { userId: ctx.session.user.id },
      _count: { _all: true },
    });

    const counts: Record<Status, number> = {
      SAVED: 0,
      APPLIED: 0,
      INTERVIEW: 0,
      PENDING: 0,
      OFFER: 0,
      REJECTED: 0,
    };

    for (const g of grouped) {
      counts[g.status] = g._count._all;
    }

    const total = Object.values(counts).reduce((sum, n) => sum + n, 0);

    return { counts, total };
  }),

  // 📅 Upcoming deadlines (today and later), soonest first
  getUpcomingDeadlines: protectedProcedure.query(({ ctx }) => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    return ctx.prisma.application.findMany({
      where: {
        userId: ctx.session.user.id,
        deadline: { gte: startOfToday },
      },
      orderBy: { deadline: "asc" },
      include: applicationInclude,
    });
  }),

  // ➕ Create Application
  create: protectedProcedure
    .input(AddApplicationSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      let companyId = input.companyId;
      let contactId: string | undefined;

      // Create company if needed
      if (!companyId && input.newCompany) {
        const createdCompany = await ctx.prisma.company.create({
          data: {
            name: input.newCompany.name,
            website: input.newCompany.website,
            userId,
          },
        });
        companyId = createdCompany.id;
      }

      contactId = await getOwnedContactId({
        contactId: input.contactId,
        userId,
        prisma: ctx.prisma,
      });

      // Create a contact inline if a new helpful contact was entered.
      if (!contactId && input.recruiter) {
        const contactData = {
          name: input.recruiter.name,
          email: input.recruiter.email,
          phone: input.recruiter.phone,
          linkedIn: normalizeLinkedIn(input.recruiter.linkedIn),
          role: input.recruiter.role ?? "Recruiter",
          type: "RECRUITER" as const,
          userId,
          companyId: companyId!,
        };

        const newContact = await ctx.prisma.contact.create({
          data: contactData,
        });
        contactId = newContact.id;
      }

      const applicationData = {
        title: input.title,
        status: input.status,
        type: input.type,
        location: input.location,
        source: input.source,
        jobUrl: input.jobUrl || null,
        deadline: input.deadline ? new Date(input.deadline) : undefined,
        favorite: input.favorite ?? false,
        userId,
        companyId: companyId!,
        contactId,
      };

      Object.assign(applicationData, { notes: input.notes || null });

      return ctx.prisma.application.create({
        data: applicationData,
      });
    }),

  // ✏️ Update Application
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: AddApplicationSchema.partial(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input;

      const { referredByRecruiter, recruiter, contactId, deadline, ...rest } =
        data;

      const formattedDeadline =
        typeof deadline === "string"
          ? new Date(deadline)
          : (deadline ?? undefined);

      let contactUpdate = {};

      const existing = await ctx.prisma.application.findFirst({
        where: { id, userId: ctx.session.user.id },
        include: { contact: true },
      });

      if (!existing) {
        throw new Error("Application not found");
      }

      if (contactId !== undefined) {
        const ownedContactId = contactId
          ? await getOwnedContactId({
              contactId,
              userId: ctx.session.user.id,
              prisma: ctx.prisma,
              linkedContactId: existing.contactId,
            })
          : undefined;

        if (ownedContactId && existing.contactId !== ownedContactId) {
          contactUpdate = { contact: { connect: { id: ownedContactId } } };
        } else if (!ownedContactId && existing.contactId) {
          contactUpdate = { contact: { disconnect: true } };
        }
      } else if (referredByRecruiter === false && existing.contactId) {
        contactUpdate = { contact: { disconnect: true } };
      }

      if (
        !contactId &&
        referredByRecruiter &&
        recruiter &&
        !existing.contactId
      ) {
        const contactData = {
          name: recruiter.name,
          email: recruiter.email,
          phone: recruiter.phone,
          linkedIn: normalizeLinkedIn(recruiter.linkedIn),
          role: recruiter.role ?? "Recruiter",
          type: "RECRUITER" as const,
          userId: ctx.session.user.id,
          companyId: rest.companyId ?? existing.companyId,
        };

        const newContact = await ctx.prisma.contact.create({
          data: contactData,
        });

        contactUpdate = { contact: { connect: { id: newContact.id } } };
      }

      const applicationData: Record<string, unknown> = {
        ...contactUpdate,
      };

      if (rest.title !== undefined) applicationData.title = rest.title;
      if (rest.status !== undefined) applicationData.status = rest.status;
      if (rest.type !== undefined) applicationData.type = rest.type;
      if (rest.location !== undefined) applicationData.location = rest.location;
      if (rest.source !== undefined) applicationData.source = rest.source;
      if (rest.favorite !== undefined) applicationData.favorite = rest.favorite;
      if (rest.companyId !== undefined)
        applicationData.companyId = rest.companyId;
      if (rest.jobUrl !== undefined) {
        applicationData.jobUrl = rest.jobUrl || null;
      }
      if (deadline !== undefined) {
        applicationData.deadline = formattedDeadline ?? null;
      }
      if (rest.notes !== undefined) {
        applicationData.notes = rest.notes || null;
      }

      return ctx.prisma.application.update({
        where: { id },
        data: applicationData,
      });
    }),

  // 🔄 Update only status (used by the Kanban drag-and-drop board)
  updateStatus: protectedProcedure
    .input(z.object({ id: z.string(), status: z.nativeEnum(Status) }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.prisma.application.findFirst({
        where: { id: input.id, userId: ctx.session.user.id },
        select: { id: true },
      });

      if (!existing) {
        throw new Error("Application not found");
      }

      return ctx.prisma.application.update({
        where: { id: input.id },
        data: { status: input.status },
      });
    }),

  // ❌ Delete Application
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.prisma.application.findFirst({
        where: { id: input.id, userId: ctx.session.user.id },
        select: { id: true },
      });

      if (!existing) {
        throw new Error("Application not found");
      }

      return ctx.prisma.application.delete({
        where: { id: input.id },
      });
    }),
});
