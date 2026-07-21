import { isRedirectError } from "next/dist/client/components/redirect-error";
import { NextResponse } from "next/server";

import { auth, signIn } from "@/server/auth";
import { publicOrigin } from "@/server/demo/demoSession";
import { mintDemoLoginToken } from "@/server/demo/demoToken";
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

    // Use Auth.js credentials sign-in so the session cookie is written the same
    // way as GitHub OAuth. Hand-minted Set-Cookie on NextResponse.redirect was
    // accepted for the first RSC pass but not kept for client/tRPC requests,
    // which left the sandbox empty (UNAUTHORIZED) after hydrate.
    const token = mintDemoLoginToken(user.id);
    await signIn("demo", {
      token,
      redirectTo: `${origin}/dashboard`,
    });

    // signIn redirects on success; this is unreachable.
    return NextResponse.redirect(new URL("/dashboard", origin));
  } catch (error) {
    if (isRedirectError(error)) throw error;

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
