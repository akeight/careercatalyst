// src/server/routers/company.ts
import { router, publicProcedure } from "../trpc";

export const companyRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.company.findMany({
      orderBy: { name: "asc" },
    });
  }),
});
