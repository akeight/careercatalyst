import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const exampleRouter = router({
  hello: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.name}!`,
        timestamp: new Date().toISOString(),
      };
    }),

  getAll: publicProcedure.query(() => {
    return {
      message: "tRPC is working!",
      items: ["item1", "item2", "item3"],
    };
  }),
});
