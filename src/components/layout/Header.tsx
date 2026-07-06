"use client";

import Link from "next/link";

import { ThemeToggle } from "../dashboard/ThemeToggle";
import { AuroraText } from "../magicui/aurora-text";
import { AuthButtons } from "@/components/AuthBtns";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Header({ authed = false }: { authed?: boolean }) {
  if (authed) {
    // Logged-in pages get their titles from the sidebar's active link, so the
    // header only needs to expose a way to open the off-canvas sidebar on
    // mobile. It stays out of the way on larger screens.
    return (
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/20 bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
        <SidebarTrigger aria-label="Open sidebar" />
      </header>
    );
  }

  return (
    <header className="flex justify-between items-center py-6 border-b-1 border-border/20">
      <div className="flex-1" />
      <div className="flex-1 text-center">
        <Link href="/" className="inline-block">
          <h1 className="px-10 text-center font-bold tracking-tight text-2xl md:text-3xl lg:text-3xl">
            Internship <AuroraText>tracker.</AuroraText>
          </h1>
        </Link>
      </div>
      <div className="flex flex-1 flex-row items-center justify-end gap-4">
        <ThemeToggle />
        <div className="flex items-center font-sans">
          <AuthButtons />
        </div>
      </div>
    </header>
  );
}
