// middleware.ts
import { auth } from "@/server/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}
// middleware.ts (continued)
export const config = {
  matcher: ["/dashboard/:path*", "/account/:path*", "/tracker/:path*"], // Add protected routes here
};
