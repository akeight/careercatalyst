"use client";
export const dynamic = "force-dynamic";

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
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card } from "../ui/card";
import AddApplicationModal from "@/components/applications/AddApplicationModal";
import React from "react";

const navLinks = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <FontAwesomeIcon icon={faHouse} size="xl" />,
  },
  {
    label: "Applications Tracker",
    href: "/tracker",
    icon: <FontAwesomeIcon icon={faCompass} size="xl" />,
  },
  {
    label: "Internship Search",
    href: "/search",
    icon: <FontAwesomeIcon icon={faLaptop} size="xl" />,
  },
  {
    label: "Saved Internships",
    href: "/saved",
    icon: <FontAwesomeIcon icon={faBookmark} size="xl" />,
  },
  {
    label: "Favorites",
    href: "/favorites",
    icon: <FontAwesomeIcon icon={faHeart} size="xl" />,
  },
  {
    label: "View Calendar",
    href: "/calendar",
    icon: <FontAwesomeIcon icon={faCalendar} size="xl" />,
  },
  // {
  //   label: "Resume Builder",
  //   href: "/resume",
  //   icon: <FontAwesomeIcon icon={faFileCircleCheck} size="xl" />,
  // },
  {
    label: "Contacts",
    href: "/boards",
    icon: <FontAwesomeIcon icon={faUser} size="xl" />,
  },
];

const supportLinks = [
  {
    label: "NSpire AI Career Coach",
    url: "https://web.nspire.ai/",
    icon: <FontAwesomeIcon icon={faBolt} size="xl" />,
  },
  {
    label: "Prampt Interview Practice",
    url: "https://www.pramp.com/#/",
    icon: <FontAwesomeIcon icon={faSuitcase} size="lg" />,
  },
  {
    label: "Resume Template",
    url: "https://www.overleaf.com/latex/templates/jakes-resume/syzfjbzwjncs",
    icon: <FontAwesomeIcon icon={faFile} size="xl" />,
  },
  //{
  //  label: "Settings",
  //  href: "/settings",
  //  icon: <FontAwesomeIcon icon={faGear} size="xl" />,
  //,
  //{
  //  label: "Help",
  //  href: "/help",
  //  icon: <FontAwesomeIcon icon={faCommentsQuestion} size="xl" />,
  // },
];

const userId = "demo@example.com";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <Card>
          <SidebarGroup>
            <SidebarGroupLabel>Home</SidebarGroupLabel>
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
                      <a
                        href={supportLinks.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
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
        <Card>
          <SidebarGroup>
            <SidebarGroupLabel>Application Hub</SidebarGroupLabel>
            <SidebarGroupContent>
              <AddApplicationModal userId={userId} />
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
