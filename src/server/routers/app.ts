import { router } from "../trpc";
import { exampleRouter } from "./example";
import { applicationRouter } from "@/server/routers/applications";
import { companyRouter } from "@/server/routers/company";
import { contactRouter } from "@/server/routers/contacts";
import { profileRouter } from "@/server/routers/profile";
import { interviewPrepRouter } from "@/server/routers/interviewPrep";

export const appRouter = router({
  example: exampleRouter,
  application: applicationRouter,
  company: companyRouter,
  contact: contactRouter,
  profile: profileRouter,
  interviewPrep: interviewPrepRouter,
});

export type AppRouter = typeof appRouter;
