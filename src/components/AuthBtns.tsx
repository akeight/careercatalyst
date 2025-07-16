// components/AuthButtons.tsx
"use client";

import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export function AuthButtons() {
  const { data: session } = useSession();

  if (session) {
    return (
      <Button onClick={() => signOut()} variant="outline">
        Sign Out
      </Button>
    );
  }
  return (
    <Link href="/login">
      <Button className="mx-3">Sign In</Button>
    </Link>
  );
}
