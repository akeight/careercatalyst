import { z } from "zod";
import { Status } from "@prisma/client";
import { router, protectedProcedure } from "../trpc";
import { AddApplicationSchema } from "@/lib/validations/AddApplicationSchema";
import { normalizeLinkedIn } from "@/lib/utils/normalizeLinkedIn";

export const applicationRouter = router({
  // 🔍 Get all applications for user
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.application.findMany({
      where: { userId: ctx.session.user.id },
      include: {
        company: true,
        contact: true,
      },
    });
  }),

  // 🌟 Get favorites
  getFavorites: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.application.findMany({
      where: {
        userId: ctx.session.user.id,
        favorite: true,
      },
      include: {
        company: true,
        contact: true,
      },
    });
  }),

  // 🔖 Get saved internships
  getSaved: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.application.findMany({
      where: {
        userId: ctx.session.user.id,
        status: "SAVED",
      },
      include: {
        company: true,
        contact: true,
      },
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
      include: { company: true },
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

      // Create recruiter contact if present
      if (input.recruiter) {
        const newContact = await ctx.prisma.contact.create({
          data: {
            name: input.recruiter.name,
            email: input.recruiter.email,
            phone: input.recruiter.phone,
            linkedIn: normalizeLinkedIn(input.recruiter.linkedIn),
            role: input.recruiter.role ?? "Recruiter",
            companyId: companyId!,
          },
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

      const { referredByRecruiter, recruiter, deadline, ...rest } = data;

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

      // ❌ CASE 1: Recruiter unchecked → delete & unlink existing contact
      if (referredByRecruiter === false && existing.contactId) {
        await ctx.prisma.contact.delete({ where: { id: existing.contactId } });
        contactUpdate = { contact: { disconnect: true } };
      }

      // ✏️ CASE 2: Recruiter checked and a contact already exists → update it
      if (referredByRecruiter && recruiter && existing.contactId) {
        await ctx.prisma.contact.update({
          where: { id: existing.contactId },
          data: {
            name: recruiter.name ?? undefined,
            email: recruiter.email ?? undefined,
            phone: recruiter.phone ?? undefined,
            linkedIn: normalizeLinkedIn(recruiter.linkedIn) ?? undefined,
          },
        });
      }

      // ➕ CASE 3: Recruiter checked but no contact yet → create one
      if (referredByRecruiter && recruiter && !existing.contactId) {
        const newContact = await ctx.prisma.contact.create({
          data: {
            name: recruiter.name,
            email: recruiter.email,
            phone: recruiter.phone,
            linkedIn: normalizeLinkedIn(recruiter.linkedIn),
            role: recruiter.role ?? "Recruiter",
            companyId: rest.companyId ?? existing.companyId,
          },
        });

        contactUpdate = { contact: { connect: { id: newContact.id } } };
      }

      const applicationData = {
        title: rest.title,
        status: rest.status,
        type: rest.type,
        location: rest.location,
        source: rest.source,
        jobUrl: rest.jobUrl,
        favorite: rest.favorite,
        companyId: rest.companyId,
        deadline: formattedDeadline,
        ...contactUpdate,
      };

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
