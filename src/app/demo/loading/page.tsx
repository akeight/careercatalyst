"use client";

import { useEffect } from "react";

import { CatalystWordmark } from "@/app/(site)/_components/CatalystWordmark";

export default function DemoLoadingPage() {
  useEffect(() => {
    // Let the loader paint before kicking off the slow seeding route. The
    // full navigation keeps this page visible until /api/demo/start responds
    // with its redirect to /dashboard.
    const t = window.setTimeout(() => {
      window.location.href = "/api/demo/start";
    }, 50);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8 px-6 text-center">
      <CatalystWordmark />
      <div className="space-y-2">
        <h1 className="font-serif text-2xl font-light tracking-tight">
          Preparing your sandbox
        </h1>
        <p className="text-sm text-muted-foreground">
          Setting up sample applications, contacts, and interview prep.
        </p>
      </div>
      <div className="relative h-px w-64 overflow-hidden rounded-full bg-border">
        <div className="demo-loading-bar absolute inset-y-0 left-0 w-1/3 rounded-full bg-primary" />
      </div>
    </main>
  );
}
