import { NextResponse } from "next/server";

import { auth } from "@/server/auth";
import {
  applySessionCookie,
  mintDemoSessionCookie,
  publicOrigin,
} from "@/server/demo/demoSession";
import {
  cleanupExpiredDemoUsers,
  deleteDemoUser,
  seedDemoUser,
} from "@/server/demo/seedDemoUser";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const DEMO_TTL_MS = 24 * 60 * 60 * 1000;

export async function GET(req: Request) {
  const origin = publicOrigin(req);
  let createdUserId: string | null = null;

  try {
    await cleanupExpiredDemoUsers();

    const session = await auth();
    if (session?.user?.isDemo && session.user.id) {
      try {
        await deleteDemoUser(session.user.id);
      } catch {
        // User may already be gone.
      }
    }

    const demoExpiresAt = new Date(Date.now() + DEMO_TTL_MS);

    const user = await prisma.user.create({
      data: {
        email: `demo-${crypto.randomUUID()}@sandbox.local`,
        name: "Demo Explorer",
        isDemo: true,
        demoExpiresAt,
        onboardedAt: new Date(),
        school: "University of Washington",
        major: "Computer Science",
        gradYear: new Date().getFullYear() + 1,
        targetRole: "Software Engineer Intern",
        weeklyGoal: 5,
      },
    });
    createdUserId = user.id;

    await seedDemoUser(user.id);

    // Mint both plain + __Secure- cookies (different JWT salts). Auth.js picks
    // which name to read from AUTH_URL protocol; a localhost AUTH_URL on Vercel
    // otherwise decrypts with the wrong salt and dumps you on /login.
    const cookies = await mintDemoSessionCookie({
      userId: user.id,
      email: user.email,
      name: user.name,
      origin,
    });

    const res = NextResponse.redirect(new URL("/dashboard", origin));
    applySessionCookie(res, cookies);
    return res;
  } catch (error) {
    console.error("[demo/start]", error);
    if (createdUserId) {
      try {
        await deleteDemoUser(createdUserId);
      } catch {
        // best-effort cleanup
      }
    }
    return NextResponse.redirect(new URL("/?demo=error", origin));
  }
}

export async function POST(req: Request) {
  return GET(req);
}
