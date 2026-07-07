"use client";

import React from "react";
import { usePathname } from "next/navigation";

import ClientHeader from "@/components/layout/ClientHeader";
import Footer from "@/components/layout/Footer";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

function SidebarAutoCollapse({ active }: { active: boolean }) {
  const { setOpen, isMobile } = useSidebar();

  React.useEffect(() => {
    if (!active || isMobile) return;
    const COLLAPSE_BELOW = 1800;
    const applyCollapse = () => setOpen(window.innerWidth >= COLLAPSE_BELOW);
    applyCollapse();
    window.addEventListener("resize", applyCollapse);
    return () => window.removeEventListener("resize", applyCollapse);
  }, [active, isMobile, setOpen]);

  return null;
}

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isTrackerRoute = pathname === "/tracker";
  const mainClassName = isTrackerRoute
    ? "w-full flex-1 min-w-0 px-4 py-8 sm:px-6 lg:px-8"
    : "mx-auto min-w-0 w-full max-w-screen-2xl flex-1 px-4 py-8 sm:px-6 lg:px-8";

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "18rem",
          "--sidebar-width-icon": "3.5rem",
        } as React.CSSProperties
      }
    >
      <SidebarAutoCollapse active={isTrackerRoute} />
      <div className="flex min-h-dvh w-full">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex min-h-dvh w-full flex-col overflow-x-hidden">
            <ClientHeader authed />
            <main className={mainClassName}>
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
        </div>
      </div>
    </SidebarProvider>
  );
}
