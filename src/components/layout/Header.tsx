"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ThemeToggle } from "../dashboard/ThemeToggle";
import { AuroraText } from "../magicui/aurora-text";
import Link from "next/link";
import { AuthButtons } from "@/components/AuthBtns";
import { useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="flex justify-between items-center py-6 border-b-1 border-border/20">
      <div className="flex-1">
        {/* You can add items here if you want them on the far left */}
      </div>
      <div className="flex-1 text-center">
        <Link href="/" className="inline-block">
          <h1 className="px-10 text-center font-bold tracking-tight text-2xl md:text-3xl lg:text-3xl">
            Internship <AuroraText>tracker.</AuroraText>
          </h1>
        </Link>
      </div>
      <div className="flex flex-1 flex-row items-center gap-4">
        {session && (
          <div className="flex items-center gap-3">
            <span className="font-serif">Hello, {session.user?.name}</span>
            <Avatar>
              <AvatarImage src={session.user?.image ?? ""} />
              <AvatarFallback>{session.user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
        )}
        <ThemeToggle />
        <div className="flex items-center font-sans">
          <AuthButtons />
        </div>
      </div>
    </header>
  );
}
