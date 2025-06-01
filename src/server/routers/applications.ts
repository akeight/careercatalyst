import { z } from "zod";
import { publicProcedure, router } from "../trpc";

// Schema
const applicationSchema = z.object({
  position: z.string(),
  company: z.string(),
  status: z.enum(["APPLIED", "INTERVIEW", "OFFER", "REJECTED", "SAVED"]),
  link: z.string().optional(),
  notes: z.string().optional(),
  deadline: z.date().optional(),
  userId: z.string(),
});

// tRPC Router
export const applicationRouter = router({
  getAll: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.application.findMany({
        where: { userId: input.userId },
        orderBy: { createdAt: "desc" },
      });
    }),

  create: publicProcedure
    .input(applicationSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.application.create({ data: input });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        data: applicationSchema.partial(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.application.update({
        where: { id: input.id },
        data: input.data,
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.application.delete({
        where: { id: input.id },
      });
    }),
});
