"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "../ui/sidebar";
//import Link from 'next/link';
//import { usePathname } from 'next/navigation';
//import { cn } from '@/lib/utils'; // optional class merging util
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@awesome.me/kit-3cb9aa7d8b/icons/duotone/solid";
import { faCalendarStar } from "@awesome.me/kit-3cb9aa7d8b/icons/duotone/solid";
import { faGear } from "@awesome.me/kit-3cb9aa7d8b/icons/duotone/solid";
import { faLaptopCode } from "@awesome.me/kit-3cb9aa7d8b/icons/duotone/solid";
import { faFontAwesome } from "@awesome.me/kit-3cb9aa7d8b/icons/duotone/solid";
import { faCommentsQuestion } from "@awesome.me/kit-3cb9aa7d8b/icons/duotone/solid";
import { faFileCircleCheck } from "@awesome.me/kit-3cb9aa7d8b/icons/duotone/solid";
import { faHandshakeAngle } from "@awesome.me/kit-3cb9aa7d8b/icons/duotone/solid";
import { faMemoPad } from "@awesome.me/kit-3cb9aa7d8b/icons/duotone/solid";
import { faBriefcase } from "@awesome.me/kit-3cb9aa7d8b/icons/duotone/solid";
import { faHeart } from "@awesome.me/kit-3cb9aa7d8b/icons/duotone/solid";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card } from "../ui/card";

const navLinks = [
  {
    label: "Home",
    href: "/dashboard",
    icon: <FontAwesomeIcon icon={faHouse} size="xl" />,
  },
  {
    label: "Applications Tracker",
    href: "/tracker",
    icon: <FontAwesomeIcon icon={faMemoPad} size="xl" />,
  },
  {
    label: "Internship Search",
    href: "/search",
    icon: <FontAwesomeIcon icon={faLaptopCode} size="xl" />,
  },
  {
    label: "Saved Internships",
    href: "/saved",
    icon: <FontAwesomeIcon icon={faFontAwesome} size="xl" />,
  },
  {
    label: "Favorites Wishlist",
    href: "/boards",
    icon: <FontAwesomeIcon icon={faHeart} size="xl" />,
  },
  {
    label: "View Calendar",
    href: "/calendar",
    icon: <FontAwesomeIcon icon={faCalendarStar} size="xl" />,
  },
  {
    label: "Resume Builder",
    href: "/resume",
    icon: <FontAwesomeIcon icon={faFileCircleCheck} size="xl" />,
  },
  {
    label: "Interview Prep",
    href: "/prep",
    icon: <FontAwesomeIcon icon={faBriefcase} size="xl" />,
  },
  {
    label: "Contacts",
    href: "/boards",
    icon: <FontAwesomeIcon icon={faHandshakeAngle} size="xl" />,
  },
];

const supportLinks = [
  {
    label: "Settings",
    href: "/settings",
    icon: <FontAwesomeIcon icon={faGear} size="xl" />,
  },
  {
    label: "Help",
    href: "/help",
    icon: <FontAwesomeIcon icon={faCommentsQuestion} size="xl" />,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <Card>
          <SidebarGroup>
            <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navLinks.map((navLinks) => (
                  <SidebarMenuItem key={navLinks.label}>
                    <SidebarMenuButton asChild>
                      <a href={navLinks.href}>
                        {navLinks.icon}
                        <span>{navLinks.label}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
            <SidebarGroupContent>
              <SidebarMenu>
                {supportLinks.map((supportLinks) => (
                  <SidebarMenuItem key={supportLinks.label}>
                    <SidebarMenuButton asChild>
                      <a href={supportLinks.href}>
                        {supportLinks.icon}
                        <span>{supportLinks.label}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </Card>
      </SidebarContent>
      <SidebarFooter>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </SidebarFooter>
    </Sidebar>
  );
}
