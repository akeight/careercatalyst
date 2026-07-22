import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";

import { InterviewPrepPage } from "@/components/interview-prep/InterviewPrepPage";
import { trpc } from "@/lib/trpc/client";
import { createServerCaller } from "@/lib/trpc/server";

export default async function ApplicationInterviewPrepRoute({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  const { applicationId } = await params;

  // Prefetch on the server so the detail page renders enabled state, research,
  // and setup without depending on the browser re-sending the session cookie.
  const queryClient = new QueryClient();
  try {
    const caller = await createServerCaller();
    const enabled = await caller.interviewPrep.isEnabled();
    queryClient.setQueryData(
      getQueryKey(trpc.interviewPrep.isEnabled, undefined, "query"),
      enabled,
    );
    if (enabled.enabled) {
      const [detail, setup] = await Promise.all([
        caller.interviewPrep.getByApplication({ applicationId }),
        caller.interviewPrep.getSetupState({ applicationId }),
      ]);
      queryClient.setQueryData(
        getQueryKey(
          trpc.interviewPrep.getByApplication,
          { applicationId },
          "query",
        ),
        detail,
      );
      queryClient.setQueryData(
        getQueryKey(
          trpc.interviewPrep.getSetupState,
          { applicationId },
          "query",
        ),
        setup,
      );
    }
  } catch {
    // Fall back to client-side fetching if SSR prefetch fails.
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="min-h-screen w-full px-4 pt-10 lg:px-6">
        <InterviewPrepPage applicationId={applicationId} />
      </div>
    </HydrationBoundary>
  );
}
