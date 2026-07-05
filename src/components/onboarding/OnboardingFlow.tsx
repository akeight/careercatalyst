"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { Rocket, Minus, Plus, PartyPopper } from "lucide-react";

import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { AuroraText } from "@/components/magicui/aurora-text";
import { easeCurve, stepVariants } from "@/lib/motion";

type FormData = {
  school: string;
  major: string;
  gradYear: string;
  targetRole: string;
  linkedInUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  weeklyGoal: number;
};

const initialData: FormData = {
  school: "",
  major: "",
  gradYear: "",
  targetRole: "",
  linkedInUrl: "",
  githubUrl: "",
  portfolioUrl: "",
  weeklyGoal: 5,
};

const TOTAL_STEPS = 5; // welcome, basics, links, goal, done

export function OnboardingFlow() {
  const router = useRouter();
  const { update } = useSession();
  const reduceMotion = useReducedMotion();

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [data, setData] = useState<FormData>(initialData);

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const completeOnboarding = trpc.profile.completeOnboarding.useMutation({
    onSuccess: async () => {
      await update({ onboarded: true });
      go(1); // advance to the done step
      if (!reduceMotion) {
        confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 } });
      }
    },
    onError: () => toast.error("Something went wrong. Please try again."),
  });

  const go = (dir: number) => {
    setDirection(dir);
    setStep((s) => Math.min(TOTAL_STEPS - 1, Math.max(0, s + dir)));
  };

  const finish = () => {
    completeOnboarding.mutate({
      school: data.school,
      major: data.major,
      gradYear: data.gradYear ? Number(data.gradYear) : undefined,
      targetRole: data.targetRole,
      linkedInUrl: data.linkedInUrl,
      githubUrl: data.githubUrl,
      portfolioUrl: data.portfolioUrl,
      weeklyGoal: data.weeklyGoal,
    });
  };

  const progress = (step / (TOTAL_STEPS - 1)) * 100;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col justify-center px-4 py-10">
      {/* Progress bar */}
      <div className="mb-8 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full rounded-full bg-primary"
          animate={{ width: `${progress}%` }}
          transition={
            reduceMotion ? { duration: 0 } : { duration: 0.5, ease: easeCurve }
          }
        />
      </div>

      <Card className="overflow-hidden">
        <CardContent className="min-h-[360px] p-8">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={reduceMotion ? undefined : stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex h-full flex-col"
            >
              {step === 0 && (
                <StepShell
                  icon={<Rocket className="size-7 text-primary" />}
                  title={
                    <>
                      Welcome to your <AuroraText>launchpad</AuroraText>
                    </>
                  }
                  subtitle="Let's set up your profile so we can tailor your internship search. It only takes a minute."
                >
                  <div className="mt-auto flex justify-end pt-8">
                    <Button onClick={() => go(1)}>Get started</Button>
                  </div>
                </StepShell>
              )}

              {step === 1 && (
                <StepShell
                  title="Tell us about you"
                  subtitle="This helps us personalize your experience. You can change it anytime."
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="School">
                      <Input
                        value={data.school}
                        onChange={(e) => set("school", e.target.value)}
                        placeholder="e.g. UC Berkeley"
                      />
                    </Field>
                    <Field label="Major">
                      <Input
                        value={data.major}
                        onChange={(e) => set("major", e.target.value)}
                        placeholder="e.g. Computer Science"
                      />
                    </Field>
                    <Field label="Graduation year">
                      <Input
                        type="number"
                        inputMode="numeric"
                        value={data.gradYear}
                        onChange={(e) => set("gradYear", e.target.value)}
                        placeholder="e.g. 2027"
                      />
                    </Field>
                    <Field label="Target role">
                      <Input
                        value={data.targetRole}
                        onChange={(e) => set("targetRole", e.target.value)}
                        placeholder="e.g. SWE Intern"
                      />
                    </Field>
                  </div>
                  <NavButtons onBack={() => go(-1)} onNext={() => go(1)} />
                </StepShell>
              )}

              {step === 2 && (
                <StepShell
                  title="Add your links"
                  subtitle="Optional, but recruiters love these. You can skip and add them later."
                >
                  <div className="space-y-4">
                    <Field label="LinkedIn">
                      <Input
                        value={data.linkedInUrl}
                        onChange={(e) => set("linkedInUrl", e.target.value)}
                        placeholder="https://linkedin.com/in/..."
                      />
                    </Field>
                    <Field label="GitHub">
                      <Input
                        value={data.githubUrl}
                        onChange={(e) => set("githubUrl", e.target.value)}
                        placeholder="https://github.com/..."
                      />
                    </Field>
                    <Field label="Portfolio / website">
                      <Input
                        value={data.portfolioUrl}
                        onChange={(e) => set("portfolioUrl", e.target.value)}
                        placeholder="https://yoursite.com"
                      />
                    </Field>
                  </div>
                  <NavButtons
                    onBack={() => go(-1)}
                    onNext={() => go(1)}
                    nextLabel="Continue"
                  />
                </StepShell>
              )}

              {step === 3 && (
                <StepShell
                  title="Set your weekly goal"
                  subtitle="How many applications do you want to send each week? We'll track your streak."
                >
                  <div className="flex items-center justify-center gap-6 py-4">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      aria-label="Decrease goal"
                      disabled={data.weeklyGoal <= 1}
                      onClick={() =>
                        set("weeklyGoal", Math.max(1, data.weeklyGoal - 1))
                      }
                    >
                      <Minus className="size-4" />
                    </Button>
                    <motion.span
                      key={data.weeklyGoal}
                      initial={
                        reduceMotion ? false : { scale: 0.8, opacity: 0 }
                      }
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-16 text-center text-5xl font-semibold tabular-nums"
                    >
                      {data.weeklyGoal}
                    </motion.span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      aria-label="Increase goal"
                      disabled={data.weeklyGoal >= 50}
                      onClick={() =>
                        set("weeklyGoal", Math.min(50, data.weeklyGoal + 1))
                      }
                    >
                      <Plus className="size-4" />
                    </Button>
                  </div>
                  <NavButtons
                    onBack={() => go(-1)}
                    onNext={finish}
                    nextLabel={
                      completeOnboarding.isPending ? "Finishing..." : "Finish"
                    }
                    nextDisabled={completeOnboarding.isPending}
                  />
                </StepShell>
              )}

              {step === 4 && (
                <StepShell
                  icon={<PartyPopper className="size-7 text-primary" />}
                  title="You're all set!"
                  subtitle="Your profile is ready. Let's start tracking your path to a great internship."
                >
                  <div className="mt-auto flex justify-end pt-8">
                    <Button
                      onClick={() => {
                        router.push("/dashboard");
                        router.refresh();
                      }}
                    >
                      Go to dashboard
                    </Button>
                  </div>
                </StepShell>
              )}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}

function StepShell({
  icon,
  title,
  subtitle,
  children,
}: {
  icon?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-1 flex-col">
      {icon && (
        <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10">
          {icon}
        </div>
      )}
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      {subtitle && (
        <p className="mt-2 mb-6 text-sm text-muted-foreground">{subtitle}</p>
      )}
      {children}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function NavButtons({
  onBack,
  onNext,
  nextLabel = "Next",
  nextDisabled,
}: {
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
}) {
  return (
    <div className="mt-auto flex justify-between pt-8">
      <Button type="button" variant="ghost" onClick={onBack}>
        Back
      </Button>
      <Button type="button" onClick={onNext} disabled={nextDisabled}>
        {nextLabel}
      </Button>
    </div>
  );
}
