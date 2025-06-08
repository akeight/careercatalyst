// src/server/context.ts

import { auth } from "@/server/auth";
import { prisma } from "@/lib/prisma";

export const createTRPCContext = async () => {
  const session = await auth();
  return {
    session,
    prisma,
  };
};

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
