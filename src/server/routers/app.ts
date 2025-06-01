import { router } from "../trpc";
import { exampleRouter } from "./example";
import { applicationRouter } from "@/server/routers/applications";

export const appRouter = router({
  example: exampleRouter,
  application: applicationRouter,
});

export type AppRouter = typeof appRouter;
