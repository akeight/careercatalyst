import { NextResponse } from "next/server";

import { auth } from "@/server/auth";

// TEMPORARY diagnostic endpoint for the demo session-drop investigation.
// Returns which cookies the browser sent (names only, no values), the host the
// request hit, and whether auth() resolved a session. Remove after debugging.
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const cookieHeader = req.headers.get("cookie") ?? "";
  const cookieNames = cookieHeader
    .split(";")
    .map((c) => c.split("=")[0]?.trim())
    .filter(Boolean);

  let sessionResolved = false;
  let isDemo = false;
  let userIdPresent = false;
  try {
    const session = await auth();
    sessionResolved = Boolean(session?.user);
    isDemo = Boolean(session?.user?.isDemo);
    userIdPresent = Boolean(session?.user?.id);
  } catch {
    // ignore
  }

  return NextResponse.json({
    cookieNames,
    hasSessionCookie: cookieNames.some((n) =>
      n.includes("authjs.session-token"),
    ),
    host: req.headers.get("host"),
    xForwardedHost: req.headers.get("x-forwarded-host"),
    xForwardedProto: req.headers.get("x-forwarded-proto"),
    secFetchMode: req.headers.get("sec-fetch-mode"),
    secFetchSite: req.headers.get("sec-fetch-site"),
    referer: req.headers.get("referer"),
    sessionResolved,
    isDemo,
    userIdPresent,
    time: new Date().toISOString(),
  });
}
