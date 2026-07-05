import { z } from "zod";
import { startOfWeek, subWeeks } from "date-fns";
import { router, protectedProcedure } from "../trpc";
import { ProfileSchema } from "@/lib/validations/ProfileSchema";
import { GoalSchema } from "@/lib/validations/GoalSchema";

const WEEK_STARTS_ON = 1; // Monday

// Normalizes empty-string form values into null for optional DB columns.
const orNull = (value?: string | null) =>
  value === undefined ? undefined : value === "" ? null : value;

// Counts trailing consecutive weeks (ending this week) that met the weekly
// application goal. The current, still-in-progress week never breaks a streak.
function computeStreak(createdDates: Date[], weeklyGoal: number) {
  const counts = new Map<number, number>();
  for (const date of createdDates) {
    const key = startOfWeek(date, { weekStartsOn: WEEK_STARTS_ON }).getTime();
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const currentWeek = startOfWeek(new Date(), { weekStartsOn: WEEK_STARTS_ON });
  const thisWeekCount = counts.get(currentWeek.getTime()) ?? 0;

  let streak = thisWeekCount >= weeklyGoal ? 1 : 0;

  // The current week is still in progress, so failing it doesn't reset the
  // streak; we resume counting from the previous completed week.
  let cursor = subWeeks(currentWeek, 1);
  while ((counts.get(cursor.getTime()) ?? 0) >= weeklyGoal) {
    streak += 1;
    cursor = subWeeks(cursor, 1);
  }

  return { streak, thisWeekCount };
}

const profileFields = {
  school: true,
  major: true,
  gradYear: true,
  targetRole: true,
  linkedInUrl: true,
  githubUrl: true,
  portfolioUrl: true,
  resumeUrl: true,
  resumeName: true,
  weeklyGoal: true,
  onboardedAt: true,
  name: true,
  email: true,
  image: true,
} as const;

export const profileRouter = router({
  // 🔍 Full profile: user fields, goals, and computed streak.
  get: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const [user, goals, applications] = await Promise.all([
      ctx.prisma.user.findUnique({
        where: { id: userId },
        select: profileFields,
      }),
      ctx.prisma.goal.findMany({
        where: { userId },
        orderBy: [{ completed: "asc" }, { createdAt: "desc" }],
      }),
      ctx.prisma.application.findMany({
        where: { userId },
        select: { createdAt: true },
      }),
    ]);

    const weeklyGoal = user?.weeklyGoal ?? 5;
    const { streak, thisWeekCount } = computeStreak(
      applications.map((a) => a.createdAt),
      weeklyGoal,
    );

    return { user, goals, streak, thisWeekCount, weeklyGoal };
  }),

  // ✏️ Update profile fields (also used from the profile page).
  updateProfile: protectedProcedure
    .input(ProfileSchema.partial())
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          school: orNull(input.school),
          major: orNull(input.major),
          gradYear: input.gradYear ?? undefined,
          targetRole: orNull(input.targetRole),
          linkedInUrl: orNull(input.linkedInUrl),
          githubUrl: orNull(input.githubUrl),
          portfolioUrl: orNull(input.portfolioUrl),
          weeklyGoal: input.weeklyGoal ?? undefined,
        },
        select: profileFields,
      });
    }),

  // 🚀 Save initial onboarding answers and mark onboarding complete.
  completeOnboarding: protectedProcedure
    .input(ProfileSchema.partial())
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          school: orNull(input.school),
          major: orNull(input.major),
          gradYear: input.gradYear ?? undefined,
          targetRole: orNull(input.targetRole),
          linkedInUrl: orNull(input.linkedInUrl),
          githubUrl: orNull(input.githubUrl),
          portfolioUrl: orNull(input.portfolioUrl),
          weeklyGoal: input.weeklyGoal ?? undefined,
          onboardedAt: new Date(),
        },
        select: profileFields,
      });
    }),

  goals: router({
    // ➕ Create a goal
    create: protectedProcedure
      .input(GoalSchema)
      .mutation(async ({ ctx, input }) => {
        return ctx.prisma.goal.create({
          data: {
            title: input.title,
            description: input.description || null,
            targetDate: input.targetDate ? new Date(input.targetDate) : null,
            userId: ctx.session.user.id,
          },
        });
      }),

    // ✅ Toggle completion
    toggle: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const existing = await ctx.prisma.goal.findFirst({
          where: { id: input.id, userId: ctx.session.user.id },
          select: { id: true, completed: true },
        });
        if (!existing) throw new Error("Goal not found");

        return ctx.prisma.goal.update({
          where: { id: existing.id },
          data: { completed: !existing.completed },
        });
      }),

    // ✏️ Update a goal
    update: protectedProcedure
      .input(z.object({ id: z.string(), data: GoalSchema.partial() }))
      .mutation(async ({ ctx, input }) => {
        const existing = await ctx.prisma.goal.findFirst({
          where: { id: input.id, userId: ctx.session.user.id },
          select: { id: true },
        });
        if (!existing) throw new Error("Goal not found");

        const { title, description, targetDate } = input.data;

        return ctx.prisma.goal.update({
          where: { id: existing.id },
          data: {
            title: title ?? undefined,
            description:
              description === undefined ? undefined : description || null,
            targetDate:
              targetDate === undefined
                ? undefined
                : targetDate
                  ? new Date(targetDate)
                  : null,
          },
        });
      }),

    // ❌ Delete a goal
    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const existing = await ctx.prisma.goal.findFirst({
          where: { id: input.id, userId: ctx.session.user.id },
          select: { id: true },
        });
        if (!existing) throw new Error("Goal not found");

        return ctx.prisma.goal.delete({ where: { id: existing.id } });
      }),
  }),
});
