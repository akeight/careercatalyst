import { encode } from "next-auth/jwt";
import type { NextResponse } from "next/server";
import type { NextAuthConfig } from "next-auth";

const SESSION_MAX_AGE = 24 * 60 * 60; // 24h

const COOKIE_PLAIN = "authjs.session-token";
const COOKIE_SECURE = "__Secure-authjs.session-token";

function authSecret() {
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET or NEXTAUTH_SECRET is required");
  }
  return secret;
}

function envAuthUrl(): URL | null {
  const raw = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL;
  if (!raw) return null;
  try {
    return new URL(raw);
  } catch {
    return null;
  }
}

/**
 * Local/dev cookie config.
 * Auth.js derives Secure cookie names from NEXTAUTH_URL/AUTH_URL. When that
 * points at production HTTPS, localhost demo sessions never stick. Force the
 * plain cookie name in non-production so proxy/auth can read it.
 */
export const authSessionCookie = {
  name: COOKIE_PLAIN,
  options: {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: false,
  },
} satisfies NonNullable<NextAuthConfig["cookies"]>["sessionToken"];

/** Public site origin for redirects (honors Vercel forwarded headers). */
export function publicOrigin(req: Request): string {
  const host = req.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const proto = req.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  if (host) {
    return `${proto ?? "https"}://${host}`;
  }
  return new URL(req.url).origin;
}

/**
 * Which session cookie Auth.js will read for this deployment.
 * When AUTH_URL/NEXTAUTH_URL is set, Auth.js rewrites the request URL to that
 * origin — so cookie secure/name follow the *env* protocol, not the browser's.
 */
export function expectedSessionCookie() {
  const envUrl = envAuthUrl();
  const secure = envUrl
    ? envUrl.protocol === "https:"
    : process.env.NODE_ENV === "production";
  return {
    name: secure ? COOKIE_SECURE : COOKIE_PLAIN,
    secure,
  };
}

type MintedCookie = {
  cookieName: string;
  token: string;
  maxAge: number;
  secure: boolean;
};

async function encodeSessionToken(
  args: {
    userId: string;
    email: string;
    name: string | null;
  },
  cookieName: string,
) {
  return encode({
    token: {
      sub: args.userId,
      id: args.userId,
      email: args.email,
      name: args.name,
      onboarded: true,
      isDemo: true,
    },
    secret: authSecret(),
    // Salt MUST equal the cookie name Auth.js will decode with.
    salt: cookieName,
    maxAge: SESSION_MAX_AGE,
  });
}

/**
 * Mint session cookies for both plain and __Secure- names.
 * Prod AUTH_URL misconfig (localhost vs https) otherwise encrypts with one salt
 * while auth() decrypts with another → empty session → redirect to /login.
 */
export async function mintDemoSessionCookie(args: {
  userId: string;
  email: string;
  name: string | null;
  origin?: string;
}): Promise<MintedCookie[]> {
  const variants = [
    { cookieName: COOKIE_PLAIN, secure: false },
    { cookieName: COOKIE_SECURE, secure: true },
  ] as const;

  return Promise.all(
    variants.map(async ({ cookieName, secure }) => ({
      cookieName,
      secure,
      maxAge: SESSION_MAX_AGE,
      token: await encodeSessionToken(args, cookieName),
    })),
  );
}

export function applySessionCookie(
  res: NextResponse,
  cookies: MintedCookie[] | MintedCookie,
) {
  const list = Array.isArray(cookies) ? cookies : [cookies];
  for (const cookie of list) {
    res.cookies.set(cookie.cookieName, cookie.token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: cookie.secure,
      maxAge: cookie.maxAge,
    });
  }
}

export function clearSessionCookies(res: NextResponse) {
  res.cookies.set(COOKIE_PLAIN, "", { path: "/", maxAge: 0 });
  res.cookies.set(COOKIE_SECURE, "", {
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
