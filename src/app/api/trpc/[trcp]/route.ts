// /app/api/trpc/[trpc]/route.ts

import { appRouter } from "@/server/routers/app";
import { createTRPCContext } from "@/server/context";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

export const maxDuration = 300;

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: createTRPCContext,
  });

export { handler as GET, handler as POST };
