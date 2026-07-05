// middleware.ts
import { auth } from "@/server/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const session = await auth();
  const { pathname } = req.nextUrl;

  if (!session?.user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Send users who haven't finished onboarding to the wizard.
  if (!session.user.onboarded && pathname !== "/onboarding") {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  // Onboarded users shouldn't see the wizard again.
  if (session.user.onboarded && pathname === "/onboarding") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}
// middleware.ts (continued)
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/account/:path*",
    "/tracker/:path*",
    "/calendar/:path*",
    "/favorites/:path*",
    "/profile/:path*",
    "/onboarding",
  ], // Add protected routes here
};
