"use client";

import { motion, useReducedMotion } from "motion/react";

import { trpc } from "@/lib/trpc/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { AuroraText } from "@/components/magicui/aurora-text";
import { fadeInUp, staggerContainer } from "@/lib/motion";

import { ProfileForm } from "./ProfileForm";
import { WeeklyGoalSettings } from "./WeeklyGoalSettings";
import { StreakCard } from "./StreakCard";
import { GoalsList } from "./GoalsList";
import { LinksSection } from "./LinksSection";
import { ResumeUpload } from "./ResumeUpload";

function initialsFrom(name?: string | null, email?: string | null) {
  return (
    (name ?? email ?? "?")
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?"
  );
}

export function ProfilePageClient() {
  const reduceMotion = useReducedMotion();
  const { data, isLoading } = trpc.profile.get.useQuery();

  if (isLoading || !data) {
    return (
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="size-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-48 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  const { user, goals, streak, thisWeekCount, weeklyGoal } = data;
  const displayName = user?.name ?? "Your profile";
  const initials = initialsFrom(user?.name, user?.email);

  const item = reduceMotion ? undefined : fadeInUp;

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* Hero */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative mb-8 overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-transparent to-primary/5 p-8"
      >
        <div className="flex items-center gap-4">
          <Avatar className="size-16 border shadow-sm">
            {user?.image && <AvatarImage src={user.image} alt={displayName} />}
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h1 className="text-3xl font-semibold tracking-tight">
              <AuroraText>{displayName}</AuroraText>
            </h1>
            {user?.email && (
              <p className="truncate text-sm text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Sections */}
      <motion.div
        variants={reduceMotion ? undefined : staggerContainer}
        initial={reduceMotion ? false : "hidden"}
        animate="visible"
        className="space-y-6"
      >
        <motion.div variants={item}>
          <StreakCard
            streak={streak}
            thisWeekCount={thisWeekCount}
            weeklyGoal={weeklyGoal}
          />
        </motion.div>
        <motion.div variants={item}>
          <WeeklyGoalSettings weeklyGoal={weeklyGoal} />
        </motion.div>
        <motion.div variants={item}>
          <GoalsList goals={goals} />
        </motion.div>
        <motion.div variants={item}>
          <ProfileForm user={user} />
        </motion.div>
        <motion.div variants={item}>
          <LinksSection user={user} />
        </motion.div>
        <motion.div variants={item}>
          <ResumeUpload
            resumeUrl={user?.resumeUrl}
            resumeName={user?.resumeName}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
