import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth"; // adjust path if needed
import prisma from "@/lib/prisma";

export const createContext = async () => {
  const session = await getServerSession(authOptions);
  return {
    session,
    prisma,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
