import { NextResponse } from "next/server";

import { auth } from "@/server/auth";
import {
  applySessionCookie,
  mintDemoSessionCookie,
} from "@/server/demo/demoSession";
import {
  cleanupExpiredDemoUsers,
  deleteDemoUser,
  seedDemoUser,
} from "@/server/demo/seedDemoUser";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const DEMO_TTL_MS = 24 * 60 * 60 * 1000;

function originFrom(req: Request) {
  return new URL(req.url).origin;
}

export async function GET(req: Request) {
  const origin = originFrom(req);

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

    await seedDemoUser(user.id);

    // Mint the session cookie for *this* origin so AUTH_URL pointing at
    // production cannot bounce localhost visitors to the prod login page.
    const cookie = await mintDemoSessionCookie({
      userId: user.id,
      email: user.email,
      name: user.name,
      origin,
    });

    const res = NextResponse.redirect(new URL("/dashboard", origin));
    applySessionCookie(res, cookie);
    return res;
  } catch (error) {
    console.error("[demo/start]", error);
    return NextResponse.redirect(new URL("/?demo=error", origin));
  }
}

export async function POST(req: Request) {
  return GET(req);
}
