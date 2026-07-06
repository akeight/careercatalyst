import { auth } from "@/server/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  const session = await auth();
  const { pathname } = req.nextUrl;

  if (!session?.user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (!session.user.onboarded && pathname !== "/onboarding") {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/tracker/:path*",
    "/search/:path*",
    "/favorites/:path*",
    "/contacts/:path*",
    "/calendar/:path*",
    "/profile/:path*",
    "/saved/:path*",
    "/onboarding",
  ],
};
