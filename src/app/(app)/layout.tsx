import { redirect } from "next/navigation";

import { AppProviders } from "@/components/AppProviders";
import { AppChrome } from "@/components/layout/AppChrome";
import { auth } from "@/server/auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
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
