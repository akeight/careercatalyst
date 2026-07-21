// proxy.ts — Next.js 16 network boundary (formerly middleware).
// Use the Auth.js wrapper so the incoming request cookies are applied to
// req.auth. A bare `await auth()` here often sees no session and redirects
// soft navigations (e.g. the demo tour) to /login.
import { auth } from "@/server/auth";
import { NextResponse } from "next/server";

export const proxy = auth((req) => {
  const { pathname } = req.nextUrl;

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
