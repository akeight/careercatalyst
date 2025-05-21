'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils'; // optional class merging util
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faHouse } from "@awesome.me/kit-3cb9aa7d8b/icons/duotone/regular";
import { faCalendarLines } from "@awesome.me/kit-3cb9aa7d8b/icons/duotone/regular";
import { faGear } from "@awesome.me/kit-3cb9aa7d8b/icons/duotone/regular";
import { faLaptopCode } from "@awesome.me/kit-3cb9aa7d8b/icons/duotone/regular";
import { faFontAwesome } from "@awesome.me/kit-3cb9aa7d8b/icons/duotone/regular";
import { faCommentsQuestion } from "@awesome.me/kit-3cb9aa7d8b/icons/duotone/regular";
import { faFileCircleCheck } from "@awesome.me/kit-3cb9aa7d8b/icons/duotone/regular";
import { faHandshakeAngle } from "@awesome.me/kit-3cb9aa7d8b/icons/duotone/regular";
import { faMemoPad } from "@awesome.me/kit-3cb9aa7d8b/icons/duotone/regular";
import { faBriefcase } from "@awesome.me/kit-3cb9aa7d8b/icons/duotone/regular";

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

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="h-full w-64 border-r bg-background p-4 hidden md:block">
            <div className="mb-6">
                <hr/>
                <h2 className="text-xl font-bold tracking-tight"></h2>
            </div>

            <nav className="space-y-2">
                {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition hover:bg-muted',
                            pathname === link.href ? 'bg-muted font-semibold' : 'text-muted-foreground'
                        )}
                    >
                        {link.icon}
                        <span>{link.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="mt-10 border-t pt-4 space-y-2">
                {supportLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition hover:bg-muted',
                            pathname === link.href ? 'bg-muted font-semibold' : 'text-muted-foreground'
                        )}
                    >
                        {link.icon}
                        <span>{link.label}</span>
                    </Link>
                ))}
            </div>
        </aside>
    );
}
