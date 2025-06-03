import { router } from "../trpc";
import { exampleRouter } from "./example";
import { applicationRouter } from "@/server/routers/applications";
import { companyRouter } from "@/server/routers/company";

export const appRouter = router({
  example: exampleRouter,
  application: applicationRouter,
  company: companyRouter,
});

export type AppRouter = typeof appRouter;
