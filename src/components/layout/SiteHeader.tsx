import Link from "next/link";

import { ThemeToggle } from "@/components/dashboard/ThemeToggle";
import { AuroraText } from "@/components/magicui/aurora-text";
import { Button } from "@/components/ui/button";

export default function SiteHeader() {
  return (
    <header className="flex items-center justify-between border-b border-border/20 py-6">
      <div className="flex-1" />
      <div className="flex-1 text-center">
        <Link href="/" className="inline-block">
          <h1 className="px-10 text-center text-2xl font-bold tracking-tight md:text-3xl lg:text-3xl">
            Internship <AuroraText>tracker.</AuroraText>
          </h1>
        </Link>
      </div>
      <div className="flex flex-1 flex-row items-center justify-end gap-4">
        <ThemeToggle />
        <div className="flex items-center font-sans">
          <Link href="/login">
            <Button className="mx-3">Sign In</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
