import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { OnboardingShell } from "@/app/(auth)/_components/OnboardingShell";

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams?: Promise<{ force?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;
  const force = params?.force === "1";

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.onboarded && !force) {
    redirect("/dashboard");
  }

  return (
    <OnboardingShell
      title="Set up your workspace."
      subtitle="A few quick details so Catalyst can tailor your search and goals."
    >
      <OnboardingFlow />
    </OnboardingShell>
  );
}
