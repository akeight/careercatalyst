"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

import ClientHeader from "@/components/layout/ClientHeader";
import Footer from "@/components/layout/Footer";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

const publicRoutes = new Set(["/", "/login", "/onboarding"]);

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { status } = useSession();

  const showAuthenticatedChrome =
    status === "authenticated" && !publicRoutes.has(pathname);
  const isLoginRoute = pathname === "/login";

  const pageContent = (
    <div className="flex min-h-dvh w-full flex-col overflow-x-hidden">
      <ClientHeader authed={showAuthenticatedChrome} />
      <main
        className={
          isLoginRoute
            ? "w-full flex-1 min-w-0"
            : "mx-auto max-w-screen-2xl w-full flex-1 px-4 sm:px-6 lg:px-8 py-8 min-w-0"
        }
      >
        {children}
        <Toaster
          position="top-center"
          richColors
          closeButton
          expand
          theme="system"
          duration={3500}
        />
      </main>
      <Footer />
    </div>
  );

  if (!showAuthenticatedChrome) {
    return pageContent;
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "18rem",
          "--sidebar-width-icon": "3.5rem",
        } as React.CSSProperties
      }
    >
      <div className="flex min-h-dvh w-full">
        <AppSidebar />
        <div className="min-w-0 flex flex-1 flex-col">{pageContent}</div>
      </div>
    </SidebarProvider>
  );
}
