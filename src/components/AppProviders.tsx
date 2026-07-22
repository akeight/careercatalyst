"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { TRPCProvider } from "@/lib/trpc/provider";
import React from "react";

export function AppProviders({
  children,
  session = null,
}: {
  children: React.ReactNode;
  session?: Session | null;
}) {
  return (
    <SessionProvider session={session} refetchOnWindowFocus={false}>
      <TRPCProvider>{children}</TRPCProvider>
    </SessionProvider>
  );
}
