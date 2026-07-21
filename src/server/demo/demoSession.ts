import { encode } from "next-auth/jwt";
import type { NextResponse } from "next/server";
import type { NextAuthConfig } from "next-auth";

const SESSION_MAX_AGE = 24 * 60 * 60; // 24h

function authSecret() {
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET or NEXTAUTH_SECRET is required");
  }
  return secret;
}

/**
 * Local/dev cookie config.
 * Auth.js derives Secure cookie names from NEXTAUTH_URL/AUTH_URL. When that
 * points at production HTTPS, localhost demo sessions never stick. Force the
 * plain cookie name in non-production so proxy/auth can read it.
 */
export const authSessionCookie = {
  name: "authjs.session-token",
  options: {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: false,
  },
} satisfies NonNullable<NextAuthConfig["cookies"]>["sessionToken"];

function sessionCookieForOrigin(origin: string) {
  if (process.env.NODE_ENV === "production" && origin.startsWith("https://")) {
    return {
      name: "__Secure-authjs.session-token",
      secure: true,
    };
  }
  return {
    name: authSessionCookie.name,
    secure: false,
  };
}

export async function mintDemoSessionCookie(args: {
  userId: string;
  email: string;
  name: string | null;
  origin: string;
}) {
  const { name: cookieName, secure } = sessionCookieForOrigin(args.origin);
  const token = await encode({
    token: {
      sub: args.userId,
      id: args.userId,
      email: args.email,
      name: args.name,
      onboarded: true,
      isDemo: true,
    },
    secret: authSecret(),
    salt: cookieName,
    maxAge: SESSION_MAX_AGE,
  });

  return {
    cookieName,
    token,
    maxAge: SESSION_MAX_AGE,
    secure,
  };
}

export function applySessionCookie(
  res: NextResponse,
  cookie: Awaited<ReturnType<typeof mintDemoSessionCookie>>,
) {
  res.cookies.set(cookie.cookieName, cookie.token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: cookie.secure,
    maxAge: cookie.maxAge,
  });

  // Drop the other variant so a leftover prod Secure cookie doesn't win.
  const other =
    cookie.cookieName === "authjs.session-token"
      ? "__Secure-authjs.session-token"
      : "authjs.session-token";
  res.cookies.set(other, "", {
    path: "/",
    maxAge: 0,
    ...(other.startsWith("__Secure-") ? { secure: true } : {}),
  });
}

export function clearSessionCookies(res: NextResponse) {
  res.cookies.set("authjs.session-token", "", { path: "/", maxAge: 0 });
  res.cookies.set("__Secure-authjs.session-token", "", {
    path: "/",
    maxAge: 0,
    secure: true,
  });
  res.cookies.set("authjs.callback-url", "", { path: "/", maxAge: 0 });
  res.cookies.set("__Secure-authjs.callback-url", "", {
    path: "/",
    maxAge: 0,
    secure: true,
  });
  res.cookies.set("authjs.csrf-token", "", { path: "/", maxAge: 0 });
  res.cookies.set("__Host-authjs.csrf-token", "", {
    path: "/",
    maxAge: 0,
    secure: true,
  });
}
