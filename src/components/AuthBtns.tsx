// components/AuthButtons.tsx
"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import Link from "next/link";

export function AuthButtons() {
  return (
    <div>
      <Link href="/login">
        <Button className="mx-3">Sign In</Button>
      </Link>
      <Button onClick={() => signOut()} variant="outline">
        Sign Out
      </Button>
    </div>
  );
}
