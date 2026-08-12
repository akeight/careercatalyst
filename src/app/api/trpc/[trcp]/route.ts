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
    onError({ error, path }) {
      // Surface server-side failures in logs. Without this, tRPC only returns
      // the error in the HTTP response body, so 500s are invisible in the
      // terminal.
      console.error(`[trpc] ${path ?? "<no-path>"} failed:`, error);
    },
  });

export { handler as GET, handler as POST };
