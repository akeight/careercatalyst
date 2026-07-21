import { NextResponse } from "next/server";

import { auth } from "@/server/auth";
import { clearSessionCookies, publicOrigin } from "@/server/demo/demoSession";
import { deleteDemoUser } from "@/server/demo/seedDemoUser";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const origin = publicOrigin(req);
  const url = new URL(req.url);
  const next = url.searchParams.get("next") === "login" ? "/login" : "/";

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
