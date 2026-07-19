import { z } from "zod";
import { after } from "next/server";
import { TRPCError } from "@trpc/server";
import type { ResearchRunMode, Status } from "@prisma/client";
import { router, protectedProcedure } from "../trpc";
import { isInterviewPrepEnabled } from "@/lib/env";
import {
  MOBILE_SPECIALIZATION_VALUES,
  ROLE_FAMILY_VALUES,
} from "@/lib/roleFamily";
import { JOB_DESCRIPTION_MIN_FOR_RESEARCH } from "@/lib/validations/AddApplicationSchema";
import { SNAPSHOT_SCHEMA_VERSION } from "@/lib/validations/companySnapshotSchema";
import { BRIEF_SCHEMA_VERSION } from "@/lib/validations/interviewBriefSchema";
import {
  buildIdempotencyKey,
  hashJobDescription,
} from "@/server/interview-prep/hash";
import { RESEARCH_LIMITS } from "@/server/interview-prep/limits";
import {
  briefStaleReason,
  snapshotStaleReason,
} from "@/server/interview-prep/freshness";
import { runApplicationResearchPipeline } from "@/server/interview-prep/runApplicationResearchPipeline";
import { researchLog } from "@/server/interview-prep/log";
import type { createTRPCContext } from "@/server/context";

const modeSchema = z.enum(["SNAPSHOT", "INTERVIEW_BRIEF"]);

type Ctx = Awaited<ReturnType<typeof createTRPCContext>>;

function assertFeatureEnabled() {
  if (!isInterviewPrepEnabled()) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Interview Prep is not enabled.",
    });
  }
}

function stageLabel(stage: string | null | undefined): string | null {
  if (!stage) return null;
  const labels: Record<string, string> = {
    REVIEWING_POSITION: "Reviewing the position",
    IDENTIFYING_COMPANY: "Identifying the company",
    RESEARCHING_OFFICIAL_SOURCES: "Researching official sources",
    FINDING_RECENT_DEVELOPMENTS: "Finding recent developments",
    BUILDING_ROLE_INSIGHTS: "Building role-specific insights",
    CONNECTING_CANDIDATE_CONTEXT: "Connecting candidate context",
    VALIDATING_CITATIONS: "Validating citations",
    SAVING_BRIEF: "Saving the brief",
  };
  return labels[stage] ?? stage;
}

function deriveHubState(args: {
  highestLevel: string;
  latestRun?: {
    mode: string;
    status: string;
  } | null;
  snapshotStale: string | null;
  briefStale: string | null;
}): string {
  const run = args.latestRun;
  if (run && (run.status === "PENDING" || run.status === "RUNNING")) {
    return run.mode === "SNAPSHOT" ? "SNAPSHOT_GENERATING" : "BRIEF_GENERATING";
  }
  if (run?.status === "FAILED") return "FAILED";
  if (run?.status === "PARTIAL") return "PARTIAL";
  if (args.highestLevel === "INTERVIEW_BRIEF") {
    if (args.briefStale) return "STALE";
    return "BRIEF_READY";
  }
  if (args.highestLevel === "SNAPSHOT") {
    if (args.snapshotStale) return "STALE";
    return "SNAPSHOT_READY";
  }
  return "NOT_RESEARCHED";
}

async function enqueueGeneration(
  ctx: Ctx,
  applicationId: string,
  mode: z.infer<typeof modeSchema>,
) {
  assertFeatureEnabled();
  if (!ctx.session?.user?.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  const userId = ctx.session.user.id;
  const app = await ctx.prisma.application.findFirst({
    where: { id: applicationId, userId },
    include: { research: true },
  });
  if (!app) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Application not found",
    });
  }

  if (
    !app.jobDescription ||
    app.jobDescription.trim().length < JOB_DESCRIPTION_MIN_FOR_RESEARCH
  ) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "A saved job description is required.",
    });
  }
  if (!app.roleFamily) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Role family is required.",
    });
  }

  const since = new Date();
  since.setHours(0, 0, 0, 0);
  const runsToday = await ctx.prisma.applicationResearchRun.count({
    where: { userId, createdAt: { gte: since } },
  });
  if (runsToday >= RESEARCH_LIMITS.maxRunsPerUserPerDay) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "Daily research limit reached.",
    });
  }

  const active = await ctx.prisma.applicationResearchRun.findFirst({
    where: {
      applicationId: app.id,
      mode,
      status: { in: ["PENDING", "RUNNING"] },
    },
    orderBy: { createdAt: "desc" },
  });
  if (active) {
    return { runId: active.id, coalesced: true as const };
  }

  const jdHash = hashJobDescription(app.jobDescription);
  const schemaVersion =
    mode === "SNAPSHOT" ? SNAPSHOT_SCHEMA_VERSION : BRIEF_SCHEMA_VERSION;
  const baseKey = buildIdempotencyKey({
    userId,
    applicationId: app.id,
    mode,
    jobDescriptionHash: jdHash,
    roleFamily: app.roleFamily,
    schemaVersion,
  });

  const existingByKey = await ctx.prisma.applicationResearchRun.findUnique({
    where: { idempotencyKey: baseKey },
  });
  if (
    existingByKey &&
    (existingByKey.status === "PENDING" || existingByKey.status === "RUNNING")
  ) {
    return { runId: existingByKey.id, coalesced: true as const };
  }

  const research = await ctx.prisma.applicationResearch.upsert({
    where: { applicationId: app.id },
    create: {
      applicationId: app.id,
      userId,
      jobDescriptionHash: jdHash,
    },
    update: { jobDescriptionHash: jdHash },
  });

  const idempotencyKey =
    existingByKey &&
    (existingByKey.status === "COMPLETED" ||
      existingByKey.status === "PARTIAL" ||
      existingByKey.status === "FAILED")
      ? `${baseKey}:${Date.now()}`
      : baseKey;

  const run = await ctx.prisma.applicationResearchRun.create({
    data: {
      applicationId: app.id,
      researchId: research.id,
      userId,
      mode: mode as ResearchRunMode,
      status: "PENDING",
      stage: "REVIEWING_POSITION",
      idempotencyKey,
    },
  });

  researchLog("run_enqueued", {
    runId: run.id,
    mode,
    applicationId: app.id,
  });

  after(() => {
    void runApplicationResearchPipeline(ctx.prisma, run.id);
  });

  return { runId: run.id, coalesced: false as const };
}

export const interviewPrepRouter = router({
  listHub: protectedProcedure.query(async ({ ctx }) => {
    assertFeatureEnabled();
    const userId = ctx.session.user.id;
    const applications = await ctx.prisma.application.findMany({
      where: { userId },
      include: {
        company: true,
        research: {
          include: {
            runs: { orderBy: { createdAt: "desc" }, take: 1 },
          },
        },
      },
    });

    const items = applications.map((app) => {
      const research = app.research;
      const latestRun = research?.runs[0] ?? null;
      const jdHash = app.jobDescription
        ? hashJobDescription(app.jobDescription)
        : null;
      const hashChanged =
        !!jdHash &&
        !!research?.jobDescriptionHash &&
        jdHash !== research.jobDescriptionHash;
      const snapStale = snapshotStaleReason(
        research?.snapshotGeneratedAt,
        hashChanged,
      );
      const brStale = briefStaleReason(research?.briefGeneratedAt, hashChanged);
      const hubState = deriveHubState({
        highestLevel: research?.highestLevel ?? "NONE",
        latestRun,
        snapshotStale: snapStale,
        briefStale: brStale,
      });

      return {
        applicationId: app.id,
        companyName: app.company.name,
        title: app.title,
        status: app.status,
        roleFamily: app.roleFamily,
        hubState,
        highestLevel: research?.highestLevel ?? "NONE",
        snapshotGeneratedAt: research?.snapshotGeneratedAt,
        briefGeneratedAt: research?.briefGeneratedAt,
        snapshotExcerpt: research?.snapshotExcerpt,
        briefExcerpt: research?.briefExcerpt,
        snapshotSourceCount: research?.snapshotSourceCount ?? 0,
        briefSourceCount: research?.briefSourceCount ?? 0,
        runStage: stageLabel(latestRun?.stage),
        runStatus: latestRun?.status ?? null,
        runMode: latestRun?.mode ?? null,
        missingJobDescription:
          !app.jobDescription ||
          app.jobDescription.trim().length < JOB_DESCRIPTION_MIN_FOR_RESEARCH,
        missingRoleFamily: !app.roleFamily,
        deadline: app.deadline,
        updatedAt: app.updatedAt,
      };
    });

    items.sort((a, b) => {
      const rank = (s: Status) =>
        s === "INTERVIEW" ? 0 : s === "APPLIED" ? 1 : 2;
      const r = rank(a.status) - rank(b.status);
      if (r !== 0) return r;
      const da = a.deadline?.getTime() ?? Number.MAX_SAFE_INTEGER;
      const db = b.deadline?.getTime() ?? Number.MAX_SAFE_INTEGER;
      if (da !== db) return da - db;
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    });

    return items;
  }),

  getSummary: protectedProcedure
    .input(z.object({ applicationId: z.string() }))
    .query(async ({ ctx, input }) => {
      assertFeatureEnabled();
      const app = await ctx.prisma.application.findFirst({
        where: { id: input.applicationId, userId: ctx.session.user.id },
        include: {
          company: true,
          research: {
            include: {
              runs: { orderBy: { createdAt: "desc" }, take: 1 },
            },
          },
        },
      });
      if (!app) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Application not found",
        });
      }
      const research = app.research;
      const latestRun = research?.runs[0] ?? null;
      const jdHash = app.jobDescription
        ? hashJobDescription(app.jobDescription)
        : null;
      const hashChanged =
        !!jdHash &&
        !!research?.jobDescriptionHash &&
        jdHash !== research.jobDescriptionHash;

      return {
        applicationId: app.id,
        status: app.status,
        companyName: app.company.name,
        title: app.title,
        roleFamily: app.roleFamily,
        jobDescription: app.jobDescription,
        missingJobDescription:
          !app.jobDescription ||
          app.jobDescription.trim().length < JOB_DESCRIPTION_MIN_FOR_RESEARCH,
        missingRoleFamily: !app.roleFamily,
        highestLevel: research?.highestLevel ?? "NONE",
        snapshotExcerpt: research?.snapshotExcerpt,
        briefExcerpt: research?.briefExcerpt,
        snapshotGeneratedAt: research?.snapshotGeneratedAt,
        briefGeneratedAt: research?.briefGeneratedAt,
        snapshotSourceCount: research?.snapshotSourceCount ?? 0,
        briefSourceCount: research?.briefSourceCount ?? 0,
        snapshotStaleReason: snapshotStaleReason(
          research?.snapshotGeneratedAt,
          hashChanged,
        ),
        briefStaleReason: briefStaleReason(
          research?.briefGeneratedAt,
          hashChanged,
        ),
        activeRun:
          latestRun &&
          (latestRun.status === "PENDING" || latestRun.status === "RUNNING")
            ? {
                id: latestRun.id,
                mode: latestRun.mode,
                status: latestRun.status,
                stage: latestRun.stage,
                stageLabel: stageLabel(latestRun.stage),
              }
            : null,
        latestRun: latestRun
          ? {
              id: latestRun.id,
              mode: latestRun.mode,
              status: latestRun.status,
              stageLabel: stageLabel(latestRun.stage),
              errorMessage: latestRun.errorMessage,
            }
          : null,
      };
    }),

  getByApplication: protectedProcedure
    .input(z.object({ applicationId: z.string() }))
    .query(async ({ ctx, input }) => {
      assertFeatureEnabled();
      const app = await ctx.prisma.application.findFirst({
        where: { id: input.applicationId, userId: ctx.session.user.id },
        include: {
          company: true,
          research: {
            include: {
              sources: { orderBy: { relevanceScore: "desc" } },
              runs: { orderBy: { createdAt: "desc" }, take: 5 },
            },
          },
        },
      });
      if (!app) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Application not found",
        });
      }
      return app;
    }),

  getRun: protectedProcedure
    .input(z.object({ runId: z.string() }))
    .query(async ({ ctx, input }) => {
      assertFeatureEnabled();
      const run = await ctx.prisma.applicationResearchRun.findFirst({
        where: { id: input.runId, userId: ctx.session.user.id },
      });
      if (!run) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Run not found" });
      }

      if (
        (run.status === "RUNNING" || run.status === "PENDING") &&
        run.updatedAt.getTime() <
          Date.now() - RESEARCH_LIMITS.stuckRunMinutes * 60 * 1000
      ) {
        const updated = await ctx.prisma.applicationResearchRun.update({
          where: { id: run.id },
          data: {
            status: "FAILED",
            errorCode: "TIMEOUT",
            errorMessage: "Research run timed out. You can retry.",
            finishedAt: new Date(),
          },
        });
        return { ...updated, stageLabel: stageLabel(updated.stage) };
      }

      return { ...run, stageLabel: stageLabel(run.stage) };
    }),

  getSetupState: protectedProcedure
    .input(z.object({ applicationId: z.string(), mode: modeSchema.optional() }))
    .query(async ({ ctx, input }) => {
      assertFeatureEnabled();
      const app = await ctx.prisma.application.findFirst({
        where: { id: input.applicationId, userId: ctx.session.user.id },
        include: { company: true, research: true },
      });
      if (!app) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Application not found",
        });
      }
      const missing: string[] = [];
      if (
        !app.jobDescription ||
        app.jobDescription.trim().length < JOB_DESCRIPTION_MIN_FOR_RESEARCH
      ) {
        missing.push("jobDescription");
      }
      if (!app.roleFamily) missing.push("roleFamily");
      if (
        app.roleFamily === "MOBILE_DEVELOPMENT" &&
        !app.mobileSpecialization
      ) {
        missing.push("mobileSpecialization");
      }
      return {
        ready: missing.length === 0,
        missing,
        application: app,
        candidateContext: app.research?.candidateContext ?? null,
      };
    }),

  updateSetup: protectedProcedure
    .input(
      z.object({
        applicationId: z.string(),
        jobDescription: z.string().max(20000).optional(),
        roleFamily: z.enum(ROLE_FAMILY_VALUES).optional(),
        mobileSpecialization: z
          .enum(MOBILE_SPECIALIZATION_VALUES)
          .optional()
          .nullable(),
        candidateContext: z.string().max(8000).optional().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      assertFeatureEnabled();
      const userId = ctx.session.user.id;
      const app = await ctx.prisma.application.findFirst({
        where: { id: input.applicationId, userId },
      });
      if (!app) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Application not found",
        });
      }

      const roleFamily = input.roleFamily ?? app.roleFamily;
      await ctx.prisma.application.update({
        where: { id: app.id },
        data: {
          ...(input.jobDescription !== undefined
            ? { jobDescription: input.jobDescription.trim() || null }
            : {}),
          ...(input.roleFamily !== undefined
            ? { roleFamily: input.roleFamily }
            : {}),
          mobileSpecialization:
            roleFamily === "MOBILE_DEVELOPMENT"
              ? (input.mobileSpecialization ??
                app.mobileSpecialization ??
                "NOT_SPECIFIED")
              : null,
        },
      });

      if (input.candidateContext !== undefined) {
        await ctx.prisma.applicationResearch.upsert({
          where: { applicationId: app.id },
          create: {
            applicationId: app.id,
            userId,
            candidateContext: input.candidateContext,
          },
          update: { candidateContext: input.candidateContext },
        });
      }

      return { ok: true };
    }),

  startGeneration: protectedProcedure
    .input(
      z.object({
        applicationId: z.string(),
        mode: modeSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return enqueueGeneration(ctx, input.applicationId, input.mode);
    }),

  retry: protectedProcedure
    .input(z.object({ applicationId: z.string(), mode: modeSchema }))
    .mutation(async ({ ctx, input }) => {
      return enqueueGeneration(ctx, input.applicationId, input.mode);
    }),

  refresh: protectedProcedure
    .input(z.object({ applicationId: z.string(), mode: modeSchema }))
    .mutation(async ({ ctx, input }) => {
      return enqueueGeneration(ctx, input.applicationId, input.mode);
    }),

  reportClaim: protectedProcedure
    .input(
      z.object({
        applicationId: z.string(),
        claimPath: z.string().max(200),
        note: z.string().max(1000),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      assertFeatureEnabled();
      const app = await ctx.prisma.application.findFirst({
        where: { id: input.applicationId, userId: ctx.session.user.id },
        select: { id: true },
      });
      if (!app) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Application not found",
        });
      }
      researchLog("claim_reported", {
        applicationId: input.applicationId,
        claimPath: input.claimPath,
        noteLength: input.note.length,
      });
      return { ok: true };
    }),

  isEnabled: protectedProcedure.query(() => {
    return { enabled: isInterviewPrepEnabled() };
  }),
});
