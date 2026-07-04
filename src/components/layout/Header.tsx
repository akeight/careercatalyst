"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

import { ThemeToggle } from "../dashboard/ThemeToggle";
import { AuroraText } from "../magicui/aurora-text";
import { AuthButtons } from "@/components/AuthBtns";
import { SidebarTrigger } from "@/components/ui/sidebar";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/tracker": "Applications Tracker",
  "/search": "Internship Search",
  "/saved": "Saved Internships",
  "/favorites": "Favorites",
  "/calendar": "Calendar",
  "/boards": "Contacts",
};

function getPageTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname];
  const match = Object.keys(pageTitles).find((href) =>
    pathname.startsWith(href),
  );
  return match ? pageTitles[match] : "Dashboard";
}

export default function Header({ authed = false }: { authed?: boolean }) {
  const pathname = usePathname();

  if (authed) {
    return (
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/20 bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <SidebarTrigger />
        <div className="h-5 w-px bg-border/40" />
        <h1 className="truncate text-lg font-semibold tracking-tight">
          {getPageTitle(pathname)}
        </h1>
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
