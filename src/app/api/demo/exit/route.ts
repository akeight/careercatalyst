import { NextResponse } from "next/server";

import { auth } from "@/server/auth";
import { clearSessionCookies, publicOrigin } from "@/server/demo/demoSession";
import { deleteDemoUser } from "@/server/demo/seedDemoUser";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const origin = publicOrigin(req);
  const url = new URL(req.url);
  const next = url.searchParams.get("next") === "login" ? "/login" : "/";

  // Never tear down the demo session on a prefetch. Next.js prefetches
  // in-viewport links, which would otherwise silently delete the demo user and
  // clear the session cookie before the user ever clicks anything.
  const isPrefetch =
    req.headers.get("next-router-prefetch") === "1" ||
    (req.headers.get("sec-purpose") ?? "").includes("prefetch") ||
    (req.headers.get("purpose") ?? "") === "prefetch";
  if (isPrefetch) {
    return NextResponse.redirect(new URL(next, origin));
  }

  try {
    const session = await auth();
    if (session?.user?.isDemo && session.user.id) {
      try {
        await deleteDemoUser(session.user.id);
      } catch {
        // Already deleted.
      }
    }
  } catch (error) {
    console.error("[demo/exit] session cleanup", error);
  }

  const res = NextResponse.redirect(new URL(next, origin));
  clearSessionCookies(res);
  return res;
}

export async function POST(req: Request) {
  return GET(req);
}
