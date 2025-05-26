"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ThemeToggle } from "../dashboard/ThemeToggle";
import { AuroraText } from "../magicui/aurora-text";
import Link from "next/link";

export default function Header() {
  return (
    <header className="py-6 px-4 border-b-1 border-gray-200">
      <Link href="/">
        <h1 className="text-center font-bold tracking-tight text-2xl md:text-3xl lg:text-3xl">
          Internship <AuroraText>tracker.</AuroraText>
        </h1>
      </Link>
      <div className="flex items-end justify-end gap-x-5 mr-5">
        <ThemeToggle />
        <div className="flex">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
