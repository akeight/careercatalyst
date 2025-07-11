import { z } from "zod";
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

      return ctx.prisma.application.create({
        data: {
          title: input.title,
          status: input.status,
          type: input.type,
          location: input.location,
          source: input.source,
          deadline: input.deadline ? new Date(input.deadline) : undefined,
          favorite: input.favorite ?? false,
          userId,
          companyId: companyId!,
          contactId,
        },
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

      const existing = await ctx.prisma.application.findUnique({
        where: { id },
        include: { contact: true },
      });

      // ❌ If recruiter unchecked, delete & unlink
      if (referredByRecruiter === false && existing?.contactId) {
        await ctx.prisma.contact.delete({ where: { id: existing.contactId } });
        contactUpdate = { contact: { disconnect: true } };
      }

      // ✏️ If recruiter is still checked and contact exists, update it
      if (referredByRecruiter && recruiter && existing?.contactId) {
        await ctx.prisma.contact.update({
          where: { id: existing.contactId },
          data: {
            name: recruiter.name ?? undefined,
            email: recruiter.email ?? undefined,
            phone: recruiter.phone ?? undefined,
            linkedIn: recruiter.linkedIn ?? undefined,
          },
        });
        // CASE 3: Recruiter checked, but no contact exists yet → create new
        if (referredByRecruiter && recruiter && !existing?.contactId) {
          const newContact = await ctx.prisma.contact.create({
            data: {
              name: recruiter.name,
              email: recruiter.email,
              phone: recruiter.phone,
              linkedIn: recruiter.linkedIn,
              companyId: existing!.companyId,
            },
          });

          contactUpdate = { contact: { connect: { id: newContact.id } } };
        }
      }

      return ctx.prisma.application.update({
        where: { id },
        data: {
          title: rest.title,
          status: rest.status,
          type: rest.type,
          location: rest.location,
          source: rest.source,
          favorite: rest.favorite,
          companyId: rest.companyId,
          deadline: formattedDeadline,
          ...contactUpdate,
        },
      });
    }),

  // ❌ Delete Application
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.application.delete({
        where: { id: input.id },
      });
    }),
});
