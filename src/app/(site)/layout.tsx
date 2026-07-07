import { redirect } from "next/navigation";

import { auth } from "@/server/auth";
import Footer from "@/components/layout/Footer";
import SiteHeader from "@/components/layout/SiteHeader";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-dvh w-full flex-col overflow-x-hidden">
      <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <SiteHeader />
      </div>
      <main className="mx-auto min-w-0 w-full max-w-screen-2xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
