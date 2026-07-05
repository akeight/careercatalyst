import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { ContactFormSchema } from "@/lib/validations/ContactFormSchema";
import { normalizeLinkedIn } from "@/lib/utils/normalizeLinkedIn";

export const contactRouter = router({
  // 🔍 Get all contacts for the current user, alphabetized
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.contact.findMany({
      where: { userId: ctx.session.user.id },
      include: { company: true },
      orderBy: { name: "asc" },
    });
  }),

  // ➕ Create a new contact
  create: protectedProcedure
    .input(ContactFormSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      let companyId = input.companyId || undefined;

      // Create company if a new one was typed
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

      return ctx.prisma.contact.create({
        data: {
          name: input.name,
          type: input.type,
          title: input.title || null,
          email: input.email || null,
          phone: input.phone || null,
          linkedIn: normalizeLinkedIn(input.linkedIn || undefined) ?? null,
          notes: input.notes || null,
          role: input.role || null,
          userId,
          companyId: companyId ?? null,
        },
      });
    }),

  // ✏️ Update a contact
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: ContactFormSchema.partial(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { id, data } = input;

      const existing = await ctx.prisma.contact.findFirst({
        where: { id, userId },
        select: { id: true },
      });

      if (!existing) {
        throw new Error("Contact not found");
      }

      let companyId = data.companyId || undefined;
      if (!companyId && data.newCompany) {
        const createdCompany = await ctx.prisma.company.create({
          data: {
            name: data.newCompany.name,
            website: data.newCompany.website,
            userId,
          },
        });
        companyId = createdCompany.id;
      }

      return ctx.prisma.contact.update({
        where: { id },
        data: {
          name: data.name,
          type: data.type,
          title: data.title,
          email: data.email,
          phone: data.phone,
          linkedIn:
            data.linkedIn !== undefined
              ? (normalizeLinkedIn(data.linkedIn || undefined) ?? null)
              : undefined,
          notes: data.notes,
          role: data.role,
          companyId: companyId ?? (data.companyId === "" ? null : undefined),
        },
      });
    }),

  // ❌ Delete a contact
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.prisma.contact.findFirst({
        where: { id: input.id, userId: ctx.session.user.id },
        select: { id: true },
      });

      if (!existing) {
        throw new Error("Contact not found");
      }

      return ctx.prisma.contact.delete({
        where: { id: input.id },
      });
    }),
});
