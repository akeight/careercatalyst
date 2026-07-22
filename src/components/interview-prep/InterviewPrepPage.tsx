"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ROLE_FAMILY_LABELS,
  ROLE_FAMILY_VALUES,
  MOBILE_SPECIALIZATION_LABELS,
  MOBILE_SPECIALIZATION_VALUES,
  suggestRoleFamily,
  type RoleFamilyValue,
} from "@/lib/roleFamily";

function Claim({ text, status }: { text: string; status?: string }) {
  return (
    <li className="text-sm">
      {text}
      {status && status !== "verified" ? (
        <span className="ml-2 text-xs text-muted-foreground">({status})</span>
      ) : null}
    </li>
  );
}

function copyText(label: string, text: string) {
  void navigator.clipboard.writeText(text);
  toast.success(`Copied ${label}`);
}

function InterviewPrepSetupForm({
  applicationId,
  initialJobDescription,
  initialRoleFamily,
  initialMobileSpec,
  initialCandidateContext,
  onSaved,
}: {
  applicationId: string;
  initialJobDescription: string;
  initialRoleFamily: RoleFamilyValue | "";
  initialMobileSpec: string;
  initialCandidateContext: string;
  onSaved: () => void;
}) {
  const [jobDescription, setJobDescription] = useState(initialJobDescription);
  const [roleFamily, setRoleFamily] = useState<RoleFamilyValue | "">(
    initialRoleFamily,
  );
  const [mobileSpec, setMobileSpec] = useState(initialMobileSpec);
  const [candidateContext, setCandidateContext] = useState(
    initialCandidateContext,
  );

  const updateSetup = trpc.interviewPrep.updateSetup.useMutation({
    onSuccess: () => {
      toast.success("Setup saved");
      onSaved();
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <section className="space-y-4 rounded-lg border p-4">
      <h2 className="text-lg font-semibold">Setup required</h2>
      <p className="text-sm text-muted-foreground">
        Save a job description and confirm the role family before research.
      </p>
      <div className="space-y-2">
        <label className="text-sm font-medium">Job description</label>
        <Textarea
          className="min-h-40"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Role family</label>
          <Select
            value={roleFamily || undefined}
            onValueChange={(v) => setRoleFamily(v as RoleFamilyValue)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select role family" />
            </SelectTrigger>
            <SelectContent>
              {ROLE_FAMILY_VALUES.map((v) => (
                <SelectItem key={v} value={v}>
                  {ROLE_FAMILY_LABELS[v]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {roleFamily === "MOBILE_DEVELOPMENT" && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Mobile specialization</label>
            <Select value={mobileSpec} onValueChange={setMobileSpec}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MOBILE_SPECIALIZATION_VALUES.map((v) => (
                  <SelectItem key={v} value={v}>
                    {MOBILE_SPECIALIZATION_LABELS[v]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Candidate context (optional, for Full Brief)
        </label>
        <Textarea
          value={candidateContext}
          onChange={(e) => setCandidateContext(e.target.value)}
          placeholder="Projects, skills, or stories you want the brief to consider…"
        />
      </div>
      <Button
        disabled={updateSetup.isPending || !roleFamily}
        onClick={() =>
          updateSetup.mutate({
            applicationId,
            jobDescription,
            roleFamily: roleFamily || undefined,
            mobileSpecialization:
              roleFamily === "MOBILE_DEVELOPMENT"
                ? (mobileSpec as (typeof MOBILE_SPECIALIZATION_VALUES)[number])
                : null,
            candidateContext: candidateContext || null,
          })
        }
      >
        Save setup
      </Button>
    </section>
  );
}

export function InterviewPrepPage({
  applicationId,
}: {
  applicationId: string;
}) {
  const { data: session } = useSession();
  const isDemo = Boolean(session?.user?.isDemo);
  // A hydrated demo session is always feature-enabled; skip the network check
  // so a flaky client request can never surface "not enabled" in the sandbox.
  const enabledQuery = trpc.interviewPrep.isEnabled.useQuery(undefined, {
    enabled: !isDemo,
  });
  const enabled = isDemo || enabledQuery.data?.enabled === true;
  const detail = trpc.interviewPrep.getByApplication.useQuery(
    { applicationId },
    {
      enabled,
      refetchInterval: 2000,
    },
  );
  const setup = trpc.interviewPrep.getSetupState.useQuery(
    { applicationId },
    { enabled },
  );

  const start = trpc.interviewPrep.startGeneration.useMutation({
    onSuccess: () => {
      toast.success("Research started");
      void detail.refetch();
    },
    onError: (e) => toast.error(e.message),
  });

  const researchBundle = detail.data?.research as
    | {
        highestLevel?: string;
        snapshotContent?: unknown;
        briefContent?: unknown;
        snapshotGeneratedAt?: Date | string | null;
        sources?: Array<{
          id: string;
          url: string;
          title: string | null;
          evidenceTier: string;
          externalId: string;
          excerpt: string | null;
        }>;
        runs?: Array<{
          status: string;
          mode: string;
          stage: string | null;
        }>;
      }
    | null
    | undefined;

  const activeRun = useMemo(() => {
    const runs = researchBundle?.runs ?? [];
    return runs.find((r) => r.status === "PENDING" || r.status === "RUNNING");
  }, [researchBundle?.runs]);

  if ((!isDemo && enabledQuery.isLoading) || detail.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-80" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!enabled) {
    return (
      <div className="rounded-lg border p-6">
        <p className="text-sm text-muted-foreground">
          Interview Prep is not enabled.
        </p>
        <Button asChild className="mt-4" variant="outline">
          <Link href="/interview-prep">Back to hub</Link>
        </Button>
      </div>
    );
  }

  if (!detail.data) {
    return (
      <p className="text-sm text-muted-foreground">Application not found.</p>
    );
  }

  const app = detail.data;
  const research = researchBundle;
  const snapshot = research?.snapshotContent as Record<string, unknown> | null;
  const brief = research?.briefContent as Record<string, unknown> | null;
  const sources = research?.sources ?? [];
  const needsSetup = setup.data && !setup.data.ready;

  const preferredMode: "SNAPSHOT" | "INTERVIEW_BRIEF" =
    app.status === "INTERVIEW" || research?.highestLevel === "SNAPSHOT"
      ? "INTERVIEW_BRIEF"
      : "SNAPSHOT";

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Button asChild variant="ghost" size="sm" className="-ml-2">
            <Link href="/interview-prep">← Interview Prep</Link>
          </Button>
          <h1 className="font-serif text-3xl font-semibold">
            {app.company.name}
          </h1>
          <p className="text-muted-foreground">{app.title}</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{app.status}</Badge>
            {app.roleFamily && (
              <Badge variant="secondary">
                {ROLE_FAMILY_LABELS[app.roleFamily as RoleFamilyValue]}
              </Badge>
            )}
            {research?.highestLevel && research.highestLevel !== "NONE" && (
              <Badge>
                {research.highestLevel === "SNAPSHOT"
                  ? "Company Snapshot"
                  : "Interview Brief"}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2" aria-live="polite">
          {activeRun ? (
            <Badge variant="secondary">
              {activeRun.mode === "SNAPSHOT" ? "Snapshot" : "Brief"}:{" "}
              {activeRun.stage?.replaceAll("_", " ").toLowerCase()}
            </Badge>
          ) : null}
          {!needsSetup && !activeRun && !isDemo && (
            <Button
              disabled={start.isPending}
              onClick={() =>
                start.mutate({ applicationId, mode: preferredMode })
              }
            >
              {preferredMode === "SNAPSHOT"
                ? "Create Company Snapshot"
                : "Build Interview Brief"}
            </Button>
          )}
          {research?.highestLevel === "INTERVIEW_BRIEF" &&
            !activeRun &&
            !isDemo && (
              <Button
                variant="outline"
                disabled={start.isPending}
                onClick={() =>
                  start.mutate({ applicationId, mode: "INTERVIEW_BRIEF" })
                }
              >
                Refresh Brief
              </Button>
            )}
          {isDemo ? (
            <p className="text-sm text-amber-800 dark:text-amber-200">
              Demo sample data — generation disabled.
            </p>
          ) : null}
        </div>
      </div>

      {needsSetup && setup.data && !isDemo ? (
        <InterviewPrepSetupForm
          key={`${applicationId}-setup`}
          applicationId={applicationId}
          initialJobDescription={setup.data.application.jobDescription ?? ""}
          initialRoleFamily={
            (setup.data.application.roleFamily as RoleFamilyValue) ??
            suggestRoleFamily(
              setup.data.application.title,
              setup.data.application.jobDescription,
            )
          }
          initialMobileSpec={
            setup.data.application.mobileSpecialization ?? "NOT_SPECIFIED"
          }
          initialCandidateContext={setup.data.candidateContext ?? ""}
          onSaved={() => {
            void setup.refetch();
            void detail.refetch();
          }}
        />
      ) : null}

      {activeRun && (
        <section className="rounded-lg border p-4" aria-live="polite">
          <h2 className="text-lg font-semibold">Generating…</h2>
          <p className="text-sm text-muted-foreground">
            You can leave this page — progress continues in the background.
          </p>
        </section>
      )}

      {snapshot && typeof snapshot === "object" && (
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-xl font-semibold">Company Snapshot</h2>
            {research?.snapshotGeneratedAt && (
              <span className="text-xs text-muted-foreground">
                {format(new Date(research.snapshotGeneratedAt), "MMM d, yyyy")}
              </span>
            )}
          </div>
          <p className="text-sm">
            {(snapshot.quickCompanySummary as { text?: string })?.text}
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold">Products & services</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {(
                  (snapshot.productsAndServices as Array<{
                    text: string;
                    evidenceStatus?: string;
                  }>) ?? []
                ).map((c, i) => (
                  <Claim key={i} text={c.text} status={c.evidenceStatus} />
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Key things to know</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {(
                  (snapshot.keyThingsToKnow as Array<{
                    text: string;
                    evidenceStatus?: string;
                  }>) ?? []
                ).map((c, i) => (
                  <Claim key={i} text={c.text} status={c.evidenceStatus} />
                ))}
              </ul>
            </div>
          </div>
          {app.status === "INTERVIEW" && !brief && !activeRun && (
            <Button
              onClick={() =>
                start.mutate({ applicationId, mode: "INTERVIEW_BRIEF" })
              }
            >
              Build Interview Brief
            </Button>
          )}
        </section>
      )}

      {brief && typeof brief === "object" && (
        <section className="space-y-6">
          <h2 className="text-xl font-semibold">Interview Brief</h2>
          <nav className="flex flex-wrap gap-2 text-sm">
            {[
              "60-second",
              "Company",
              "Role",
              "Developments",
              "Themes",
              "Questions",
              "Gaps",
              "Sources",
            ].map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase()}`}
                className="text-muted-foreground underline-offset-2 hover:underline"
              >
                {label}
              </a>
            ))}
          </nav>

          <div id="60-second" className="space-y-2">
            <h3 className="font-semibold">60-second brief</h3>
            <p className="text-sm">
              {
                (brief.quickBrief as { companySummary?: { text: string } })
                  ?.companySummary?.text
              }
            </p>
            <p className="text-sm">
              {
                (brief.quickBrief as { roleSummary?: { text: string } })
                  ?.roleSummary?.text
              }
            </p>
            <ul className="list-disc space-y-1 pl-5">
              {(
                (brief.quickBrief as { topQuestions?: string[] })
                  ?.topQuestions ?? []
              ).map((q) => (
                <li
                  key={q}
                  className="flex items-start justify-between gap-2 text-sm"
                >
                  <span>{q}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyText("question", q)}
                  >
                    Copy
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          <div id="company" className="space-y-2">
            <h3 className="font-semibold">Company overview</h3>
            <ul className="list-disc space-y-1 pl-5">
              {(
                (
                  brief.companyOverview as {
                    productsAndServices?: Array<{ text: string }>;
                  }
                )?.productsAndServices ?? []
              ).map((c, i) => (
                <Claim key={i} text={c.text} />
              ))}
            </ul>
          </div>

          <div id="role" className="space-y-4">
            <h3 className="font-semibold">Role analysis</h3>
            {(() => {
              const ra = brief.roleAnalysis as {
                mustHaveSkills?: Array<{
                  text: string;
                  evidenceStatus?: string;
                }>;
                niceToHaveSkills?: Array<{
                  text: string;
                  evidenceStatus?: string;
                }>;
                requiredSkills?: string[];
                preferredSkills?: string[];
                explicitResponsibilities?: Array<{
                  text: string;
                  evidenceStatus?: string;
                }>;
                techStackSignals?: Array<{
                  text: string;
                  evidenceStatus?: string;
                }>;
                collaborationSignals?: Array<{
                  text: string;
                  evidenceStatus?: string;
                }>;
                dayOneExpectations?: Array<{
                  text: string;
                  evidenceStatus?: string;
                }>;
                growthExpectations?: Array<{
                  text: string;
                  evidenceStatus?: string;
                }>;
                jdLanguageToProbe?: Array<{
                  phrase: string;
                  whyAsk: string;
                }>;
                ambiguities?: string[];
              };
              const rsi = brief.roleSpecificIntelligence as {
                preparationFocusAreas?: string[];
                toolsAndStackToStudy?: Array<{ text: string }>;
                points?: Array<{ text: string; evidenceStatus?: string }>;
              };

              const mustHave = ra?.mustHaveSkills?.length
                ? ra.mustHaveSkills
                : (ra?.requiredSkills ?? []).map((text) => ({ text }));
              const niceToHave = ra?.niceToHaveSkills?.length
                ? ra.niceToHaveSkills
                : (ra?.preferredSkills ?? []).map((text) => ({ text }));

              const ClaimList = ({
                title,
                items,
              }: {
                title: string;
                items?: Array<{ text: string; evidenceStatus?: string }>;
              }) =>
                items?.length ? (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{title}</p>
                    <ul className="list-disc space-y-1 pl-5">
                      {items.map((c, i) => (
                        <Claim
                          key={i}
                          text={c.text}
                          status={c.evidenceStatus}
                        />
                      ))}
                    </ul>
                  </div>
                ) : null;

              return (
                <>
                  <ClaimList title="Must-have skills" items={mustHave} />
                  <ClaimList title="Nice-to-have skills" items={niceToHave} />
                  <ClaimList
                    title="Responsibilities"
                    items={ra?.explicitResponsibilities}
                  />
                  <ClaimList
                    title="Tech stack signals"
                    items={ra?.techStackSignals}
                  />
                  <ClaimList
                    title="Collaboration"
                    items={ra?.collaborationSignals}
                  />
                  <ClaimList
                    title="Day-one expectations"
                    items={ra?.dayOneExpectations}
                  />
                  <ClaimList
                    title="Growth expectations"
                    items={ra?.growthExpectations}
                  />
                  {ra?.jdLanguageToProbe?.length ? (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        JD language to probe
                      </p>
                      <ul className="space-y-2">
                        {ra.jdLanguageToProbe.map((p, i) => (
                          <li key={i} className="text-sm">
                            <span className="font-medium">
                              &ldquo;{p.phrase}&rdquo;
                            </span>
                            <span className="text-muted-foreground">
                              {" "}
                              — {p.whyAsk}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {rsi?.preparationFocusAreas?.length ? (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Preparation focus
                      </p>
                      <ul className="list-disc space-y-1 pl-5 text-sm">
                        {rsi.preparationFocusAreas.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  <ClaimList title="Role-specific points" items={rsi?.points} />
                  {ra?.ambiguities?.length ? (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Ambiguities
                      </p>
                      <ul className="list-disc space-y-1 pl-5 text-sm">
                        {ra.ambiguities.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </>
              );
            })()}
          </div>

          <div id="developments" className="space-y-2">
            <h3 className="font-semibold">Recent developments</h3>
            <ul className="space-y-3">
              {(
                (brief.recentDevelopments as Array<{
                  headline: string;
                  summary: string;
                }>) ?? []
              ).map((d, i) => (
                <li key={i} className="text-sm">
                  <p className="font-medium">{d.headline}</p>
                  <p className="text-muted-foreground">{d.summary}</p>
                </li>
              ))}
            </ul>
          </div>

          <div id="themes" className="space-y-2">
            <h3 className="font-semibold">Likely interview themes</h3>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {(
                (
                  brief.likelyInterviewThemes as {
                    behavioralThemes?: string[];
                  }
                )?.behavioralThemes ?? []
              ).map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>

          <div id="questions" className="space-y-2">
            <h3 className="font-semibold">Questions to ask</h3>
            {(
              Object.entries(
                (brief.questionsToAsk as Record<
                  string,
                  Array<{ text: string }>
                >) ?? {},
              ) as Array<[string, Array<{ text: string }>]>
            ).map(([group, qs]) =>
              qs?.length ? (
                <div key={group}>
                  <p className="text-sm font-medium capitalize">{group}</p>
                  <ul className="mt-1 space-y-1">
                    {qs.map((q) => (
                      <li
                        key={q.text}
                        className="flex items-start justify-between gap-2 text-sm"
                      >
                        <span>{q.text}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyText("question", q.text)}
                        >
                          Copy
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null,
            )}
          </div>

          <div id="gaps" className="space-y-2">
            <h3 className="font-semibold">Research gaps</h3>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {(
                (
                  brief.researchGaps as {
                    informationNotFound?: string[];
                  }
                )?.informationNotFound ?? []
              ).map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section id="sources" className="space-y-3">
        <h2 className="text-xl font-semibold">Sources ({sources.length})</h2>
        <ul className="space-y-2">
          {sources.map((s) => (
            <li key={s.id} className="rounded-md border p-3 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline-offset-2 hover:underline"
                >
                  {s.title || s.url}
                </a>
                <Badge variant="outline">{s.evidenceTier}</Badge>
                <Badge variant="secondary">{s.externalId}</Badge>
              </div>
              {s.excerpt && (
                <p className="mt-1 line-clamp-3 text-muted-foreground">
                  {s.excerpt}
                </p>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
