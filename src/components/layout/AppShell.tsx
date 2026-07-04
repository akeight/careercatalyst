"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

import ClientHeader from "@/components/layout/ClientHeader";
import Footer from "@/components/layout/Footer";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

const publicRoutes = new Set(["/", "/login"]);

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { status } = useSession();

  const showAuthenticatedChrome =
    status === "authenticated" && !publicRoutes.has(pathname);

  const pageContent = (
    <div className="flex min-h-dvh w-full flex-col overflow-x-hidden">
      <ClientHeader />
      <main className="mx-auto max-w-screen-2xl w-full flex-1 px-4 sm:px-6 lg:px-8 py-8 min-w-0">
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
    <SidebarProvider>
      <div className="flex min-h-dvh w-full">
        <AppSidebar />
        <div className="min-w-0 flex flex-1 flex-col">
          <SidebarTrigger className="m-3" />
          {pageContent}
        </div>
      </div>
    </SidebarProvider>
  );
}
