// proxy.ts
import { auth } from "@/server/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  const session = await auth();
  const { pathname } = req.nextUrl;

  if (!session?.user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Send users who haven't finished onboarding to the wizard.
  if (!session.user.onboarded && pathname !== "/onboarding") {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  // Keep /onboarding reachable for authenticated users; the page decides
  // whether to show the flow or redirect (and can honor force overrides).

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/account/:path*",
    "/tracker/:path*",
    "/calendar/:path*",
    "/favorites/:path*",
    "/profile/:path*",
    "/interview-prep/:path*",
    "/applications/:path*",
    "/onboarding",
  ], // Add protected routes here
};
