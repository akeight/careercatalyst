export const dynamic = "force-dynamic";

import { auth } from "@/server/auth";
import type { Session } from "next-auth";
import { redirect } from "next/navigation";
import { AuthShell } from "@/app/(auth)/_components/AuthShell";
import { AuthPanel } from "@/app/(auth)/_components/AuthPanel";

export default async function LoginPage() {
  // Resolve the session in isolation. redirect() throws a NEXT_REDIRECT
  // control-flow signal, so it must live OUTSIDE any try/catch or the catch
  // swallows it and the redirect silently never happens.
  let session: Session | null = null;
  try {
    session = await auth();
  } catch (error) {
    console.error("Failed to load session:", error);
  }

  if (session?.user) {
    redirect(session.user.onboarded ? "/dashboard" : "/onboarding");
  }

  return (
    <AuthShell>
      <AuthPanel />
    </AuthShell>
  );
}
