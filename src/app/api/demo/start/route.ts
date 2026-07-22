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

    // Capture any existing demo user so we can clean it up AFTER the new
    // sandbox is seeded and its session is minted. Deleting it up-front
    // cascade-wipes the current user's rows, and if the new cookie doesn't
    // replace the old one the browser is left with an orphaned demo session
    // (valid token, zero data → empty sandbox).
    const session = await auth();
    const previousDemoUserId =
      session?.user?.isDemo && session.user.id ? session.user.id : null;

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

    // Now that the new sandbox is fully seeded, retire the previous demo user.
    if (previousDemoUserId && previousDemoUserId !== user.id) {
      try {
        await deleteDemoUser(previousDemoUserId);
      } catch {
        // Already gone; expiry cleanup will catch stragglers.
      }
    }

    // Sign in with redirect:false so Auth.js writes the session cookie via
    // next/headers WITHOUT issuing a 307 redirect. Browsers apply a cookie set
    // on a redirect response to the in-flight followed request but do not
    // reliably PERSIST it to the cookie jar, so the demo session survived only
    // the first render and every later refresh/navigation bounced to /login.
    // Returning a normal 200 document with the Set-Cookie fixes persistence.
    const token = mintDemoLoginToken(user.id);
    await signIn("demo", { token, redirect: false });

    const dashboardUrl = `${origin}/dashboard`;
    const html = `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=${dashboardUrl}"><title>Starting demo…</title></head><body><script>window.location.replace(${JSON.stringify(dashboardUrl)});</script><noscript><a href="${dashboardUrl}">Continue to the demo</a></noscript></body></html>`;

    return new NextResponse(html, {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store",
      },
    });
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
