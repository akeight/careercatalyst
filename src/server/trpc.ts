import { initTRPC } from "@trpc/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";
import { authOptions } from "@/server/auth"; // adjust path if needed
import { TRPCError } from "@trpc/server";
import prisma from "../lib/prisma";

export const createContext = async ({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}): Promise<{ session: Session | null; prisma: typeof prisma }> => {
  const session = (await getServerSession(
    req,
    res,
    authOptions,
  )) as Session | null;
  return { session, prisma };
};

const t = initTRPC.context<typeof createContext>().create();

export const router = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
    },
  });
});
