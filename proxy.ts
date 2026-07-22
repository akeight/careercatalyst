// proxy.ts — Next.js 16 network boundary (formerly middleware).
// Use the Auth.js wrapper so the incoming request cookies are applied to
// req.auth. A bare `await auth()` here often sees no session and redirects
// soft navigations (e.g. the demo tour) to /login.
import { auth } from "@/server/auth";
import { NextResponse } from "next/server";

export const proxy = auth((req) => {
  const { pathname } = req.nextUrl;

  // TEMPORARY diagnostics for the demo session-drop investigation.
  // Logs cookie-name presence (no values) so Vercel logs show whether
  // navigations carry the session cookie. Remove after debugging.
  const cookieNames = req.cookies.getAll().map((c) => c.name);
  console.log("[proxy-debug]", {
    pathname,
    host: req.headers.get("host"),
    xForwardedHost: req.headers.get("x-forwarded-host"),
    secFetchMode: req.headers.get("sec-fetch-mode"),
    secFetchSite: req.headers.get("sec-fetch-site"),
    hasSessionCookie: cookieNames.some((n) =>
      n.includes("authjs.session-token"),
    ),
    cookieNames,
    authUser: Boolean(req.auth?.user),
    isDemo: Boolean(req.auth?.user?.isDemo),
  });

  if (!req.auth?.user) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (!req.auth.user.onboarded && pathname !== "/onboarding") {
    return NextResponse.redirect(new URL("/onboarding", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/account",
    "/account/:path*",
    "/tracker",
    "/tracker/:path*",
    "/calendar",
    "/calendar/:path*",
    "/favorites",
    "/favorites/:path*",
    "/profile",
    "/profile/:path*",
    "/interview-prep",
    "/interview-prep/:path*",
    "/applications",
    "/applications/:path*",
    "/contacts",
    "/contacts/:path*",
    "/saved",
    "/saved/:path*",
    "/search",
    "/search/:path*",
    "/onboarding",
  ],
};
