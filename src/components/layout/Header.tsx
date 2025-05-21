'use client'

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/dashboard/ThemeToggle";


export default function Header() {
    return (
        <header>
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

