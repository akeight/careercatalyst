import { router } from "../trpc";
import { exampleRouter } from "./example";
import { applicationRouter } from "@/server/routers/applications";
import { companyRouter } from "@/server/routers/company";
import { contactRouter } from "@/server/routers/contacts";

export const appRouter = router({
  example: exampleRouter,
  application: applicationRouter,
  company: companyRouter,
  contact: contactRouter,
});

export type AppRouter = typeof appRouter;
