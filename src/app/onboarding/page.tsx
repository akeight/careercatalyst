import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

export default async function OnboardingPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return <OnboardingFlow />;
}
