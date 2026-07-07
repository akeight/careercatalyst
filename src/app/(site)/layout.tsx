import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/server/auth";

export const metadata: Metadata = {
  title: "Catalyst — Track every internship application in one place",
  description:
    "Catalyst keeps your applications, deadlines, notes, documents, and interview prep in one focused workspace. Built for internship season.",
};

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session?.user?.onboarded) {
    redirect("/dashboard");
  }

  return (
    <div className="site-theme-light flex min-h-dvh w-full flex-col overflow-x-clip bg-background text-foreground">
      {children}
    </div>
  );
}
