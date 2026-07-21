import { createHmac, timingSafeEqual } from "crypto";

const TOKEN_TTL_MS = 60_000;

function getSecret() {
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET or NEXTAUTH_SECRET is required for demo auth");
  }
  return secret;
}

function signPayload(payload: string) {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

/** Short-lived token proving /api/demo/start just created this demo user. */
export function mintDemoLoginToken(userId: string) {
  const expiresAt = Date.now() + TOKEN_TTL_MS;
  const payload = `${userId}:${expiresAt}`;
  return `${payload}:${signPayload(payload)}`;
}

export function verifyDemoLoginToken(token: string): string | null {
  const parts = token.split(":");
  if (parts.length !== 3) return null;

  const [userId, expiresAtRaw, signature] = parts;
  const expiresAt = Number(expiresAtRaw);
  if (!userId || !Number.isFinite(expiresAt) || expiresAt < Date.now()) {
    return null;
  }

  const payload = `${userId}:${expiresAtRaw}`;
  const expected = signPayload(payload);

  try {
    const a = Buffer.from(signature, "hex");
    const b = Buffer.from(expected, "hex");
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }

  return userId;
}
