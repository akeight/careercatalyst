import { redirect } from "next/navigation";

import { AppProviders } from "@/components/AppProviders";
import { AppChrome } from "@/components/layout/AppChrome";
import { auth } from "@/server/auth";
import { prisma } from "@/lib/prisma";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  // Self-heal orphaned demo sessions: a valid demo JWT whose user was cleaned
  // up (or wiped by a prior demo restart) would otherwise render an empty
  // sandbox. Re-mint a fresh, seeded demo instead of showing nothing.
  if (session.user.isDemo && session.user.id) {
    const demoUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true },
    });
    if (!demoUser) {
      redirect("/api/demo/start");
    }
  }

  if (!session.user.onboarded) {
    redirect("/onboarding");
  }

  return (
    <AppProviders session={session}>
      <AppChrome>{children}</AppChrome>
    </AppProviders>
  );
}
