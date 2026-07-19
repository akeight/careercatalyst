"use client";

import Link from "next/link";
import { format } from "date-fns";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export function InterviewPrepDrawerCard({
  applicationId,
  applicationStatus,
}: {
  applicationId: string;
  applicationStatus: string;
}) {
  const enabledQuery = trpc.interviewPrep.isEnabled.useQuery();
  const summary = trpc.interviewPrep.getSummary.useQuery(
    { applicationId },
    {
      enabled: enabledQuery.data?.enabled === true,
      refetchInterval: (q) => (q.state.data?.activeRun ? 2000 : false),
    },
  );
  const start = trpc.interviewPrep.startGeneration.useMutation({
    onSuccess: () => {
      toast.success("Research started");
      void summary.refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  if (enabledQuery.isLoading) return null;
  if (!enabledQuery.data?.enabled) return null;
  if (summary.isLoading) {
    return <Skeleton className="h-24 w-full rounded-lg" />;
  }
  if (!summary.data) return null;

  const data = summary.data;
  const href = `/applications/${applicationId}/interview-prep`;
  const missing = data.missingJobDescription || data.missingRoleFamily;

  let title = "Interview Prep";
  let description =
    "Research this company and role to create a complete Interview Brief.";
  let actionLabel = "Build Interview Brief";
  let actionMode: "SNAPSHOT" | "INTERVIEW_BRIEF" | null = "INTERVIEW_BRIEF";
  let linkOnly = false;

  if (data.activeRun) {
    title =
      data.activeRun.mode === "SNAPSHOT"
        ? "Company Snapshot"
        : "Interview Prep";
    description = data.activeRun.stageLabel ?? "Research in progress…";
    actionLabel = "View Progress";
    actionMode = null;
    linkOnly = true;
  } else if (missing) {
    title =
      applicationStatus === "APPLIED" ? "Company Research" : "Interview Prep";
    const gaps = [
      data.missingJobDescription ? "job description" : null,
      data.missingRoleFamily ? "role family" : null,
    ]
      .filter(Boolean)
      .join(" and ");
    description = `Add ${gaps} to continue.`;
    actionLabel = "Continue setup";
    actionMode = null;
    linkOnly = true;
  } else if (data.highestLevel === "INTERVIEW_BRIEF") {
    title = "Interview Prep";
    description = [
      data.briefExcerpt,
      data.briefGeneratedAt
        ? `Updated ${format(new Date(data.briefGeneratedAt), "MMM d, yyyy")}`
        : null,
      `${data.briefSourceCount} sources`,
    ]
      .filter(Boolean)
      .join(" · ");
    actionLabel = "Open Full Brief";
    actionMode = null;
    linkOnly = true;
  } else if (
    applicationStatus === "INTERVIEW" &&
    data.highestLevel === "SNAPSHOT"
  ) {
    title = "Interview Prep";
    description =
      "You have an interview. Turn your company research into a complete, cited Interview Brief.";
    actionLabel = "Build Interview Brief";
    actionMode = "INTERVIEW_BRIEF";
  } else if (
    applicationStatus === "APPLIED" &&
    data.highestLevel === "SNAPSHOT"
  ) {
    title = "Company Snapshot";
    description = [
      data.snapshotExcerpt,
      data.snapshotGeneratedAt
        ? `Updated ${format(new Date(data.snapshotGeneratedAt), "MMM d, yyyy")}`
        : null,
      `${data.snapshotSourceCount} sources`,
    ]
      .filter(Boolean)
      .join(" · ");
    actionLabel = "View Snapshot";
    actionMode = null;
    linkOnly = true;
  } else if (applicationStatus === "APPLIED") {
    title = "Company Research";
    description =
      "Get a quick overview of the company and position while you wait to hear back.";
    actionLabel = "Create Company Snapshot";
    actionMode = "SNAPSHOT";
  } else if (data.latestRun?.status === "FAILED") {
    description = data.latestRun.errorMessage ?? "Research failed.";
    actionLabel = "Retry";
    actionMode =
      applicationStatus === "APPLIED" ? "SNAPSHOT" : "INTERVIEW_BRIEF";
  }

  return (
    <section className="rounded-lg border p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        {linkOnly || !actionMode ? (
          <Button asChild size="sm" variant="outline">
            <Link href={href}>{actionLabel}</Link>
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            disabled={start.isPending}
            onClick={() => start.mutate({ applicationId, mode: actionMode })}
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </section>
  );
}
