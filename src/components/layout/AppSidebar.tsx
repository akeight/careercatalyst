'use client'

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter
} from "@/components/ui/sidebar"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils'; // optional class merging util
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import { faHouse } from "@awesome.me/kit-3cb9aa7d8b/icons/duotone/regular"
import { faCalendarLines } from "@awesome.me/kit-3cb9aa7d8b/icons/duotone/regular"
import { faGear } from "@awesome.me/kit-3cb9aa7d8b/icons/duotone/regular"
import { faLaptopCode } from "@awesome.me/kit-3cb9aa7d8b/icons/duotone/regular"
import { faFontAwesome } from "@awesome.me/kit-3cb9aa7d8b/icons/duotone/regular"
import { faCommentsQuestion } from "@awesome.me/kit-3cb9aa7d8b/icons/duotone/regular"
import { faFileCircleCheck } from "@awesome.me/kit-3cb9aa7d8b/icons/duotone/regular"
import { faHandshakeAngle } from "@awesome.me/kit-3cb9aa7d8b/icons/duotone/regular"
import { faMemoPad } from "@awesome.me/kit-3cb9aa7d8b/icons/duotone/regular"
import { faBriefcase } from "@awesome.me/kit-3cb9aa7d8b/icons/duotone/regular"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

const navLinks = [
    { label: 'Dashboard', href: '/', icon: <FontAwesomeIcon icon={faHouse} size="xl"/> },
    { label: 'Job Search', href: '/search', icon: <FontAwesomeIcon icon={faLaptopCode} size="xl" /> },
    { label: 'Saved Jobs', href: '/saved', icon: <FontAwesomeIcon icon={faFontAwesome} size="xl" /> },
    { label: 'Calendar', href: '/calendar', icon: <FontAwesomeIcon icon={faCalendarLines} size="xl" /> },
    { label: 'Application', href: '/application', icon: <FontAwesomeIcon icon={faMemoPad} size="xl" /> },
    { label: 'Resume', href: '/resume', icon: <FontAwesomeIcon icon={faFileCircleCheck} size="xl" /> },
    { label: 'Interview Prep', href: '/prep', icon: <FontAwesomeIcon icon={faHandshakeAngle} size="xl" /> },
    { label: 'Job Boards', href: '/boards', icon: <FontAwesomeIcon icon={faBriefcase} size="xl" /> },
];

const supportLinks = [
    { label: 'Settings', href: '/settings', icon: <FontAwesomeIcon icon={faGear} size="xl" /> },
    { label: 'Help', href: '/help', icon: <FontAwesomeIcon icon={faCommentsQuestion} size="lg" /> },
];

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Internship Tracker</SidebarGroupLabel>
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
            </SidebarContent>
            <SidebarFooter>
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </SidebarFooter>
        </Sidebar>

    )
}
