'use client'

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/dashboard/ThemeToggle";
import {AuroraText} from "@/components/magicui/aurora-text";


export default function Header() {
    return (
        <header className="py-6 px-4">
            <h1 className="text-center font-bold tracking-tight text-2xl md:text-3xl lg:text-4xl">
                Internship <AuroraText>tracker.</AuroraText>
            </h1>
            <div className="flex items-end justify-end gap-4">
                <ThemeToggle />
                <div className="flex">
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </div>
                <span className="text-sm text-muted-foreground">Welcome user</span>
            </div>
        </header>
    );
}

