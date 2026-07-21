// src/server/routers/company.ts

import { router, protectedProcedure } from "../trpc";
import { CreateCompanySchema } from "@/lib/validations/CreateCompanySchema";

export const companyRouter = router({
  // 🔍 Get all companies for the current user, alphabetized
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.company.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { name: "asc" },
    });
  }),

  // ➕ Create a new company
  create: protectedProcedure
    .input(CreateCompanySchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.company.create({
        data: {
          name: input.name,
          website: input.website,
          userId: ctx.session.user.id,
        },
      });
    }),
});
