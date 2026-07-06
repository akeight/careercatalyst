"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

import ClientHeader from "@/components/layout/ClientHeader";
import Footer from "@/components/layout/Footer";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

const publicRoutes = new Set(["/", "/login", "/onboarding"]);

// Auto-collapses the sidebar when a wide route (the Kanban board) is active and
// the viewport gets close to overflowing, reclaiming horizontal space. Lives
// inside the SidebarProvider so useSidebar always has a context.
function SidebarAutoCollapse({ active }: { active: boolean }) {
  const { setOpen, isMobile } = useSidebar();

  React.useEffect(() => {
    if (!active || isMobile) return;
    const COLLAPSE_BELOW = 1600;
    const applyCollapse = () => setOpen(window.innerWidth >= COLLAPSE_BELOW);
    applyCollapse();
    window.addEventListener("resize", applyCollapse);
    return () => window.removeEventListener("resize", applyCollapse);
  }, [active, isMobile, setOpen]);

  return null;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { status } = useSession();

  const isPublicRoute = publicRoutes.has(pathname);
  const showAuthenticatedChrome = status === "authenticated" && !isPublicRoute;
  // While the session is still resolving on a protected route, avoid rendering
  // the logged-out header (theme toggle + Sign In) so it never flashes between
  // navigations.
  const isResolvingProtected = status === "loading" && !isPublicRoute;
  const showPublicHeader = !showAuthenticatedChrome && !isResolvingProtected;
  const isLoginRoute = pathname === "/login";
  // The Kanban board still auto-collapses the sidebar, but it shares the same
  // centered content container as the other pages (favorites, contacts, saved).
  const isTrackerRoute = pathname === "/tracker";

  const mainClassName = isLoginRoute
    ? "w-full flex-1 min-w-0"
    : "mx-auto max-w-screen-2xl w-full flex-1 px-4 sm:px-6 lg:px-8 py-8 min-w-0";

  const pageContent = (
    <div className="flex min-h-dvh w-full flex-col overflow-x-hidden">
      {showAuthenticatedChrome || showPublicHeader ? (
        <ClientHeader authed={showAuthenticatedChrome} />
      ) : null}
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
      <SidebarAutoCollapse active={isTrackerRoute} />
      <div className="flex min-h-dvh w-full">
        <AppSidebar />
        <div className="min-w-0 flex flex-1 flex-col">{pageContent}</div>
      </div>
    </SidebarProvider>
  );
}
