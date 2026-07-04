"use client";
export const dynamic = "force-dynamic";

import {
  Sidebar,
  SidebarContent,
  SidebarGroupLabel,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "../ui/sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@awesome.me/kit-3cb9aa7d8b/icons/chisel/regular";
import { faCalendar } from "@awesome.me/kit-3cb9aa7d8b/icons/chisel/regular";
//import { faGear } from "@awesome.me/kit-3cb9aa7d8b/icons/chisel/regular";
import { faLaptop } from "@awesome.me/kit-3cb9aa7d8b/icons/chisel/regular";
import { faBookmark } from "@awesome.me/kit-3cb9aa7d8b/icons/chisel/regular";
//import { faCommentsQuestion } from "@awesome.me/kit-3cb9aa7d8b/icons/chisel/regular";
import { faFile } from "@awesome.me/kit-3cb9aa7d8b/icons/chisel/regular";
import { faUser } from "@awesome.me/kit-3cb9aa7d8b/icons/chisel/regular";
import { faCompass } from "@awesome.me/kit-3cb9aa7d8b/icons/chisel/regular";
import { faSuitcase } from "@awesome.me/kit-3cb9aa7d8b/icons/chisel/regular";
import { faBolt } from "@awesome.me/kit-3cb9aa7d8b/icons/chisel/regular";
import { faHeart } from "@awesome.me/kit-3cb9aa7d8b/icons/chisel/regular";
import { faArrowRightFromBracket } from "@awesome.me/kit-3cb9aa7d8b/icons/chisel/regular";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { ThemeToggle } from "@/components/dashboard/ThemeToggle";
import AddApplicationModal from "@/components/applications/AddApplicationModal";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import React from "react";

const navLinks = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <FontAwesomeIcon icon={faHouse} size="lg" />,
  },
  {
    label: "Applications Tracker",
    href: "/tracker",
    icon: <FontAwesomeIcon icon={faCompass} size="lg" />,
  },
  {
    label: "Internship Search",
    href: "/search",
    icon: <FontAwesomeIcon icon={faLaptop} size="lg" />,
  },
  {
    label: "Saved Internships",
    href: "/saved",
    icon: <FontAwesomeIcon icon={faBookmark} size="lg" />,
  },
  {
    label: "Favorites",
    href: "/favorites",
    icon: <FontAwesomeIcon icon={faHeart} size="lg" />,
  },
  {
    label: "View Calendar",
    href: "/calendar",
    icon: <FontAwesomeIcon icon={faCalendar} size="lg" />,
  },
  // {
  //   label: "Resume Builder",
  //   href: "/resume",
  //   icon: <FontAwesomeIcon icon={faFileCircleCheck} size="xl" />,
  // },
  {
    label: "Contacts",
    href: "/boards",
    icon: <FontAwesomeIcon icon={faUser} size="lg" />,
  },
];

const supportLinks = [
  {
    label: "NSpire AI Career Coach",
    url: "https://web.nspire.ai/",
    icon: <FontAwesomeIcon icon={faBolt} size="lg" />,
  },
  {
    label: "Prampt Interview Practice",
    url: "https://www.pramp.com/#/",
    icon: <FontAwesomeIcon icon={faSuitcase} size="lg" />,
  },
  {
    label: "Resume Template",
    url: "https://www.overleaf.com/latex/templates/jakes-resume/syzfjbzwjncs",
    icon: <FontAwesomeIcon icon={faFile} size="lg" />,
  },
  //{
  //  label: "Settings",
  //  href: "/settings",
  //  icon: <FontAwesomeIcon icon={faGear} size="lg" />,
  //,
  //{
  //  label: "Help",
  //  href: "/help",
  //  icon: <FontAwesomeIcon icon={faCommentsQuestion} size="lg" />,
  // },
];

const userId = "demo@example.com";

export function AppSidebar() {
  const { data: session } = useSession();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const themeTooltip =
    mounted && resolvedTheme === "dark" ? "Light mode" : "Dark mode";
  const user = session?.user;
  const displayName = user?.name ?? "Guest";
  const displayEmail = user?.email ?? "";
  const initials =
    (user?.name ?? user?.email ?? "?")
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  return (
    <Sidebar className="bg-sidebar border-r border-border/20 ">
      <SidebarContent className="p-4 space-y-6 *:data-[slot=card]:from-muted/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t ">
        {/* Logo Section */}
        <div className="flex justify-between px-3 py-2">
          <h2 className="text-lg font-semibold text-sidebar-foreground">
            Internship Tracker
          </h2>
        </div>

        {/* Navigation Section */}
        <div className="space-y-2 ">
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3">
            Navigation
          </SidebarGroupLabel>
          <div className="space-y-1 list-none">
            {navLinks.map((navLinks) => (
              <SidebarMenuItem key={navLinks.label} className="list-none">
                <SidebarMenuButton
                  asChild
                  className="w-full justify-start gap-3 px-3 py-2.5 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                >
                  <a href={navLinks.href}>
                    {navLinks.icon}
                    <span className="text-sm font-medium">
                      {navLinks.label}
                    </span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </div>
        </div>

        {/* Tools Section */}
        <div className="space-y-2">
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3">
            Tools
          </SidebarGroupLabel>
          <div className="space-y-1 list-none">
            {supportLinks.map((supportLinks) => (
              <SidebarMenuItem key={supportLinks.label} className="list-none">
                <SidebarMenuButton
                  asChild
                  className="w-full justify-start gap-3 px-3 py-2.5 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                >
                  <a
                    href={supportLinks.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {supportLinks.icon}
                    <span className="text-sm font-medium">
                      {supportLinks.label}
                    </span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="space-y-2">
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3">
            Quick Actions
          </SidebarGroupLabel>
          <div className="px-3">
            <AddApplicationModal userId={userId} />
          </div>
        </div>
      </SidebarContent>

      {/* Footer with User Profile */}
      <SidebarFooter className="p-4 mb-10 border-t border-border/20">
        <div className="flex flex-col items-center justify-between gap-3 px-3">
          <div className="flex shrink-0  gap-1.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <ThemeToggle />
              </TooltipTrigger>
              <TooltipContent>{themeTooltip}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => signOut()}
                  aria-label="Sign out"
                >
                  <FontAwesomeIcon icon={faArrowRightFromBracket} />
                  <span className="sr-only">Sign out</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Sign out</TooltipContent>
            </Tooltip>
          </div>
          <div className="flex min-w-0 items-center gap-3">
            <Avatar className="h-8 w-8">
              {user?.image && (
                <AvatarImage src={user.image} alt={displayName} />
              )}
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 text-sm">
              <p className="truncate font-medium text-sidebar-foreground">
                {displayName}
              </p>
              {displayEmail && (
                <p className="truncate text-xs text-muted-foreground">
                  {displayEmail}
                </p>
              )}
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
