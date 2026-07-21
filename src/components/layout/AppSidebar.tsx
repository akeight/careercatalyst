"use client";
export const dynamic = "force-dynamic";

import {
  Sidebar,
  SidebarContent,
  SidebarGroupLabel,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
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
import { faAddressCard } from "@awesome.me/kit-3cb9aa7d8b/icons/chisel/regular";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { ThemeToggle } from "@/components/dashboard/ThemeToggle";
import AddApplicationModal from "@/components/applications/AddApplicationModal";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils/utils";
import React from "react";
import { CatalystWordmark } from "@/app/(site)/_components/CatalystWordmark";

const navLinks = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <FontAwesomeIcon icon={faHouse} size="lg" />,
  },
  {
    label: "Applications Board",
    href: "/tracker",
    icon: <FontAwesomeIcon icon={faCompass} size="lg" />,
  },
  {
    label: "Search for Opportunities",
    href: "/search",
    icon: <FontAwesomeIcon icon={faLaptop} size="lg" />,
  },
  {
    label: "Saved for Later",
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
  //   icon: <FontAwesomeIcon icon={faFileCircleCheck} size="lg" />,
  // },
  {
    label: "Contacts",
    href: "/contacts",
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
  const { state, isMobile } = useSidebar();
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const isActiveLink = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);
  const showCollapsedTooltip = state === "collapsed" && !isMobile;
  const sidebarToggleTooltip =
    state === "collapsed" ? "Expand sidebar" : "Collapse sidebar";
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
    <Sidebar
      collapsible="icon"
      className="bg-sidebar border-r border-border/20"
    >
      <SidebarContent className="space-y-6 p-4 *:data-[slot=card]:from-muted/5 *:data-[slot=card]:to-card *:data-[slot=card]:bg-gradient-to-t group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-4 dark:*:data-[slot=card]:bg-card dark:*:data-[slot=card]:bg-none">
        {/* Logo Section */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between gap-2 px-3 py-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
            <CatalystWordmark />
            <SidebarTrigger
              className="shrink-0 group-data-[collapsible=icon]:mx-auto"
              title={sidebarToggleTooltip}
              aria-label={sidebarToggleTooltip}
            />
          </div>
          <div className="px-3 group-data-[collapsible=icon]:hidden">
            <h3 className="truncate text-sm font-normal text-sidebar-foreground group-data-[collapsible=icon]:hidden">
              Turn opportunities into offers.
            </h3>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="space-y-2 group-data-[collapsible=icon]:w-full">
          <SidebarGroupLabel className="px-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Navigation
          </SidebarGroupLabel>
          <div className="space-y-1 list-none group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center">
            {navLinks.map((navLink) => {
              const active = isActiveLink(navLink.href);
              return (
                <SidebarMenuItem key={navLink.label} className="list-none">
                  <SidebarMenuButton
                    asChild
                    isActive={active}
                    tooltip={navLink.label}
                    className={cn(
                      "h-10 w-full justify-start gap-3 rounded-md px-3 py-2.5 text-base transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-10! [&>svg]:size-5",
                      active &&
                        "data-[active=true]:bg-[var(--nav-active)]/40 data-[active=true]:text-[var(--nav-active-foreground)] hover:bg-[var(--nav-active)]/40 hover:text-[var(--nav-active-foreground)] [&>svg]:text-[var(--nav-active-foreground)]",
                    )}
                  >
                    <Link href={navLink.href}>
                      {navLink.icon}
                      <span className="text-base font-medium">
                        {navLink.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </div>
        </div>

        {/* Tools Section */}
        <div className="space-y-2 group-data-[collapsible=icon]:w-full">
          <SidebarGroupLabel className="px-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Tools
          </SidebarGroupLabel>
          <div className="space-y-1 list-none group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center">
            {supportLinks.map((supportLinks) => (
              <SidebarMenuItem key={supportLinks.label} className="list-none">
                <SidebarMenuButton
                  asChild
                  tooltip={supportLinks.label}
                  className="h-10 w-full justify-start gap-3 rounded-md px-3 py-2.5 text-base transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-10! [&>svg]:size-5"
                >
                  <a
                    href={supportLinks.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {supportLinks.icon}
                    <span className="text-base font-medium">
                      {supportLinks.label}
                    </span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="space-y-2 group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel className="px-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Quick Actions
          </SidebarGroupLabel>
          <div className="px-3">
            <AddApplicationModal userId={userId} />
          </div>
        </div>
        <div className="hidden w-full justify-center group-data-[collapsible=icon]:flex">
          <AddApplicationModal
            userId={userId}
            iconOnly
            triggerClassName="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground [&>svg]:size-10"
          />
        </div>
      </SidebarContent>

      {/* Footer with User Profile */}
      <SidebarFooter className="mb-10 border-t border-border/20 p-4 group-data-[collapsible=icon]:p-2">
        <div className="flex flex-col items-center justify-between gap-3 px-3 group-data-[collapsible=icon]:px-0">
          <div className="flex shrink-0 gap-1.5 group-data-[collapsible=icon]:flex-col">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  asChild
                  className="size-11"
                  aria-label="Profile"
                >
                  <Link href="/profile">
                    <FontAwesomeIcon icon={faAddressCard} className="!size-5" />
                    <span className="sr-only">Profile</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" hidden={!showCollapsedTooltip}>
                Profile
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <ThemeToggle className="size-11 [&_svg]:!size-5" />
              </TooltipTrigger>
              <TooltipContent side="right" hidden={!showCollapsedTooltip}>
                {themeTooltip}
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="size-11"
                  aria-label="Sign out"
                >
                  <FontAwesomeIcon
                    icon={faArrowRightFromBracket}
                    className="!size-5"
                  />
                  <span className="sr-only">Sign out</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" hidden={!showCollapsedTooltip}>
                Sign out
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="flex min-w-0 items-center gap-3 group-data-[collapsible=icon]:justify-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className="shrink-0 rounded-full"
                  tabIndex={0}
                  aria-label={
                    displayEmail
                      ? `${displayName}, ${displayEmail}`
                      : displayName
                  }
                >
                  <Avatar className="h-9 w-9">
                    {user?.image && (
                      <AvatarImage src={user.image} alt={displayName} />
                    )}
                    <AvatarFallback className="text-sm">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" hidden={!showCollapsedTooltip}>
                <div className="flex flex-col">
                  <span>{displayName}</span>
                  {displayEmail && (
                    <span className="text-xs text-muted-foreground">
                      {displayEmail}
                    </span>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
            <div className="min-w-0 text-base group-data-[collapsible=icon]:hidden">
              <p className="truncate font-medium text-sidebar-foreground">
                {displayName}
              </p>
              {displayEmail && (
                <p className="truncate text-sm text-muted-foreground">
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
