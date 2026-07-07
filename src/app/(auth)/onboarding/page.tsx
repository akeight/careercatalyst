import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

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

  return <OnboardingFlow />;
}
