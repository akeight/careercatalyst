"use client";

import Link from "next/link";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ROLE_FAMILY_LABELS, type RoleFamilyValue } from "@/lib/roleFamily";
import { toast } from "sonner";

type HubItem = {
  applicationId: string;
  companyName: string;
  title: string;
  status: string;
  roleFamily: string | null;
  hubState: string;
  highestLevel: string;
  snapshotExcerpt: string | null;
  briefExcerpt: string | null;
  runStage: string | null;
  missingJobDescription: boolean;
  missingRoleFamily: boolean;
};

function hubStateLabel(state: string) {
  const map: Record<string, string> = {
    NOT_RESEARCHED: "Not Researched",
    SNAPSHOT_READY: "Snapshot Ready",
    SNAPSHOT_GENERATING: "Snapshot Generating",
    BRIEF_READY: "Interview Brief Ready",
    BRIEF_GENERATING: "Interview Brief Generating",
    PARTIAL: "Partial",
    FAILED: "Failed",
    STALE: "Stale",
  };
  return map[state] ?? state;
}

function resolveAction(item: HubItem): {
  label: string;
  mode?: "SNAPSHOT" | "INTERVIEW_BRIEF";
  start: boolean;
} {
  if (item.missingJobDescription || item.missingRoleFamily) {
    return { label: "Complete setup", start: false };
  }
  if (
    item.hubState === "SNAPSHOT_GENERATING" ||
    item.hubState === "BRIEF_GENERATING"
  ) {
    return { label: "View Progress", start: false };
  }
  if (item.hubState === "FAILED") {
    return {
      label: "Retry",
      start: true,
      mode: item.status === "INTERVIEW" ? "INTERVIEW_BRIEF" : "SNAPSHOT",
    };
  }
  if (item.hubState === "PARTIAL") {
    return { label: "Open Partial", start: false };
  }
  if (item.status === "INTERVIEW") {
    if (item.hubState === "BRIEF_READY") {
      return { label: "Open Interview Brief", start: false };
    }
    if (item.hubState === "STALE") {
      return {
        label: "Refresh Interview Brief",
        start: true,
        mode: "INTERVIEW_BRIEF",
      };
    }
    return {
      label: "Build Interview Brief",
      start: true,
      mode: "INTERVIEW_BRIEF",
    };
  }
  if (item.status === "APPLIED") {
    if (item.hubState === "SNAPSHOT_READY" || item.hubState === "STALE") {
      return { label: "View Snapshot", start: false };
    }
    return { label: "Create Company Snapshot", start: true, mode: "SNAPSHOT" };
  }
  return { label: "Open", start: false };
}

function ItemList({
  title,
  items,
  onStart,
  starting,
}: {
  title: string;
  items: HubItem[];
  onStart: (
    applicationId: string,
    mode: "SNAPSHOT" | "INTERVIEW_BRIEF",
  ) => void;
  starting: boolean;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h2>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nothing here yet.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => {
            const href = `/applications/${item.applicationId}/interview-prep`;
            const action = resolveAction(item);
            return (
              <li key={item.applicationId} className="rounded-lg border p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-medium">
                        {item.companyName} — {item.title}
                      </h3>
                      <Badge variant="outline">{item.status}</Badge>
                      <Badge variant="secondary">
                        {hubStateLabel(item.hubState)}
                      </Badge>
                      {item.highestLevel === "SNAPSHOT" && (
                        <Badge variant="outline">Company Snapshot</Badge>
                      )}
                      {item.highestLevel === "INTERVIEW_BRIEF" && (
                        <Badge variant="outline">Interview Brief</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {item.roleFamily
                        ? ROLE_FAMILY_LABELS[item.roleFamily as RoleFamilyValue]
                        : "Role family not set"}
                      {item.runStage ? ` · ${item.runStage}` : ""}
                    </p>
                    {(item.briefExcerpt || item.snapshotExcerpt) && (
                      <p className="line-clamp-2 text-sm">
                        {item.briefExcerpt || item.snapshotExcerpt}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    {action.start && action.mode ? (
                      <Button
                        size="sm"
                        disabled={starting}
                        onClick={() =>
                          onStart(item.applicationId, action.mode!)
                        }
                      >
                        {action.label}
                      </Button>
                    ) : (
                      <Button asChild size="sm">
                        <Link href={href}>{action.label}</Link>
                      </Button>
                    )}
                    <Button asChild size="sm" variant="outline">
                      <Link href={href}>Open</Link>
                    </Button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export function InterviewPrepHub() {
  const enabledQuery = trpc.interviewPrep.isEnabled.useQuery();
  const listQuery = trpc.interviewPrep.listHub.useQuery(undefined, {
    enabled: enabledQuery.data?.enabled === true,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return false;
      const generating = data.some(
        (i) =>
          i.hubState === "SNAPSHOT_GENERATING" ||
          i.hubState === "BRIEF_GENERATING",
      );
      return generating ? 2000 : false;
    },
  });
  const start = trpc.interviewPrep.startGeneration.useMutation({
    onSuccess: () => {
      toast.success("Research started");
      void listQuery.refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  if (enabledQuery.isLoading) {
    return <Skeleton className="h-40 w-full" />;
  }

  if (!enabledQuery.data?.enabled) {
    return (
      <div className="rounded-lg border p-6">
        <h1 className="font-serif text-2xl font-semibold">Interview Prep</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Interview Prep is not enabled for this environment. Set
          INTERVIEW_PREP_ENABLED=true to turn it on.
        </p>
      </div>
    );
  }

  if (listQuery.isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  const items = (listQuery.data ?? []) as HubItem[];
  const needsAttention = items.filter(
    (i) =>
      ["NOT_RESEARCHED", "FAILED", "PARTIAL", "STALE"].includes(i.hubState) ||
      (i.status === "INTERVIEW" && i.hubState === "SNAPSHOT_READY"),
  );
  const generating = items.filter((i) =>
    ["SNAPSHOT_GENERATING", "BRIEF_GENERATING"].includes(i.hubState),
  );
  const ready = items.filter((i) =>
    ["SNAPSHOT_READY", "BRIEF_READY"].includes(i.hubState),
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-semibold">Interview Prep</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Research existing applications — Company Snapshots while you wait,
          full Interview Briefs when you interview.
        </p>
      </div>
      <ItemList
        title="Needs attention"
        items={needsAttention}
        starting={start.isPending}
        onStart={(applicationId, mode) => start.mutate({ applicationId, mode })}
      />
      <ItemList
        title="Generating"
        items={generating}
        starting={start.isPending}
        onStart={(applicationId, mode) => start.mutate({ applicationId, mode })}
      />
      <ItemList
        title="Ready"
        items={ready}
        starting={start.isPending}
        onStart={(applicationId, mode) => start.mutate({ applicationId, mode })}
      />
    </div>
  );
}
