import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { router, protectedProcedure } from "../trpc";
import {
  deleteResumeBlob,
  getSignedResumeUrl,
  isOwnedResumePathname,
} from "@/lib/storage/blob";

const RESUME_LABEL_MAX = 60;

const CreateResumeSchema = z.object({
  url: z.string().url(),
  pathname: z.string().min(1),
  fileName: z.string().min(1).max(255),
  label: z.string().trim().max(RESUME_LABEL_MAX).optional(),
  size: z.number().int().nonnegative().optional(),
});

function assertNotDemo(isDemo?: boolean) {
  if (isDemo) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Resume upload is not available in demo mode.",
    });
  }
}

export const resumeRouter = router({
  // 📄 List the user's resumes (newest first). Never exposes a directly
  // fetchable file URL — viewing goes through getViewUrl.
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.resume.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        label: true,
        fileName: true,
        size: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }),

  // ➕ Persist metadata after a client-side upload resolves.
  create: protectedProcedure
    .input(CreateResumeSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      assertNotDemo(ctx.session.user.isDemo);

      // Ownership hardening: the blob must live in this user's resume folder.
      if (!isOwnedResumePathname(input.pathname, userId)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid resume path.",
        });
      }

      return ctx.prisma.resume.create({
        data: {
          userId,
          url: input.url,
          pathname: input.pathname,
          fileName: input.fileName,
          label: input.label?.trim() || null,
          size: input.size,
        },
        select: {
          id: true,
          label: true,
          fileName: true,
          size: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    }),

  // ✏️ Rename a resume's label.
  updateLabel: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        label: z.string().trim().max(RESUME_LABEL_MAX).nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.prisma.resume.findFirst({
        where: { id: input.id, userId: ctx.session.user.id },
        select: { id: true },
      });
      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Resume not found" });
      }

      return ctx.prisma.resume.update({
        where: { id: existing.id },
        data: { label: input.label?.trim() || null },
        select: {
          id: true,
          label: true,
          fileName: true,
          size: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    }),

  // ❌ Delete a resume (blob + row). Attached applications are set to null via
  // the SetNull relation.
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.prisma.resume.findFirst({
        where: { id: input.id, userId: ctx.session.user.id },
        select: { id: true, pathname: true, url: true },
      });
      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Resume not found" });
      }

      // Only delete blobs that live in the private store (have a pathname).
      // Legacy public rows are left in place to avoid touching the old store.
      if (existing.pathname) {
        try {
          await deleteResumeBlob(existing.pathname);
        } catch (error) {
          console.error("[resume.delete] blob delete failed", error);
        }
      }

      await ctx.prisma.resume.delete({ where: { id: existing.id } });
      return { id: existing.id };
    }),

  // 🔗 Mint a short-lived signed URL to view a resume (auth + ownership checked).
  getViewUrl: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const resume = await ctx.prisma.resume.findFirst({
        where: { id: input.id, userId: ctx.session.user.id },
        select: { pathname: true, url: true },
      });
      if (!resume) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Resume not found" });
      }

      // Legacy public rows (no pathname) open via their stored URL.
      if (!resume.pathname) {
        return { url: resume.url };
      }

      const url = await getSignedResumeUrl(resume.pathname);
      return { url };
    }),
});
