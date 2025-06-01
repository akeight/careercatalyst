import { initTRPC } from "@trpc/server";
import prisma from "../lib/prisma";

export const createContext = async () => {
  return { prisma };
};

const t = initTRPC.context<typeof createContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
