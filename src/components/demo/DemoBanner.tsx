"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { DEMO_TOUR_RESTART_EVENT } from "@/components/demo/demoTourEvents";

export function DemoBanner() {
  const { data: session } = useSession();

  if (!session?.user?.isDemo) return null;

  return (
    <div
      data-tour="demo-banner"
      className="border-b border-amber-500/30 bg-amber-50 text-amber-950 dark:bg-amber-950/40 dark:text-amber-50"
    >
      <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-3 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="text-sm leading-5">
          You&apos;re exploring a demo sandbox. Changes are temporary and
          won&apos;t be saved after you leave.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-amber-600/40 bg-transparent"
            onClick={() => {
              window.dispatchEvent(new Event(DEMO_TOUR_RESTART_EVENT));
            }}
          >
            Restart tour
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-amber-600/40 bg-transparent"
            asChild
          >
            <Link href="/api/demo/exit">Exit demo</Link>
          </Button>
          <Button
            type="button"
            size="sm"
            data-tour="demo-signup"
            className="bg-amber-700 text-white hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-500"
            asChild
          >
            <Link href="/api/demo/exit?next=login">
              Sign up to save progress
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
