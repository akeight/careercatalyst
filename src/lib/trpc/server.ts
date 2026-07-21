import "server-only";

import { appRouter } from "@/server/routers/app";
import { createTRPCContext } from "@/server/context";

/**
 * Server-side tRPC caller. Uses the same context as the HTTP handler, so it
 * reads the session from cookies during SSR. This lets pages prefetch data on
 * the server (where the session cookie is always available) and hydrate the
 * client, so the demo sandbox renders data even when a browser is stingy about
 * re-sending cookies on client-side fetches.
 */
export async function createServerCaller() {
  const ctx = await createTRPCContext();
  return appRouter.createCaller(ctx);
}
