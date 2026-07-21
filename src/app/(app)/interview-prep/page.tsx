import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";

import { InterviewPrepHub } from "@/components/interview-prep/InterviewPrepHub";
import { trpc } from "@/lib/trpc/client";
import { createServerCaller } from "@/lib/trpc/server";

export default async function InterviewPrepPage() {
  // Prefetch on the server so the hub renders its enabled state and items
  // without depending on the browser re-sending the session cookie.
  const queryClient = new QueryClient();
  try {
    const caller = await createServerCaller();
    const enabled = await caller.interviewPrep.isEnabled();
    queryClient.setQueryData(
      getQueryKey(trpc.interviewPrep.isEnabled, undefined, "query"),
      enabled,
    );
    if (enabled.enabled) {
      const items = await caller.interviewPrep.listHub();
      queryClient.setQueryData(
        getQueryKey(trpc.interviewPrep.listHub, undefined, "query"),
        items,
      );
    }
  } catch {
    // Fall back to client-side fetching if SSR prefetch fails.
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="min-h-screen w-full px-4 pt-10 lg:px-6">
        <InterviewPrepHub />
      </div>
    </HydrationBoundary>
  );
}
