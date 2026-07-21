// src/server/auth.ts
import NextAuth from "next-auth";
import type { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import LinkedIn from "next-auth/providers/linkedin";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { verifyDemoLoginToken } from "@/server/demo/demoToken";
import { authSessionCookie } from "@/server/demo/demoSession";

const providers: Provider[] = [];

/** Demo columns exist on User; keep access resilient if the IDE's Prisma types lag generate. */
type UserAuthRow = {
  id: string;
  email: string | null;
  name: string | null;
  image: string | null;
  onboardedAt: Date | null;
  isDemo: boolean;
};

async function getUserAuthRow(userId: string): Promise<UserAuthRow | null> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return null;
  const row = user as typeof user & { isDemo?: boolean | null };
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
    onboardedAt: user.onboardedAt,
    isDemo: Boolean(row.isDemo),
  };
}

async function getUserAuthRowByEmail(
  email: string,
): Promise<UserAuthRow | null> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;
  const row = user as typeof user & { isDemo?: boolean | null };
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
    onboardedAt: user.onboardedAt,
    isDemo: Boolean(row.isDemo),
  };
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  providers.push(
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  );
}

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  );
}

if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
  providers.push(
    LinkedIn({
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    }),
  );
}

providers.push(
  Credentials({
    id: "demo",
    name: "Demo sandbox",
    credentials: {
      token: { label: "Token", type: "text" },
    },
    async authorize(credentials) {
      const token = String(credentials?.token ?? "");
      const userId = verifyDemoLoginToken(token);
      if (!userId) return null;

      const user = await getUserAuthRow(userId);
      if (!user?.isDemo) return null;

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        isDemo: true,
      };
    },
  }),
);

if (process.env.NODE_ENV !== "production") {
  providers.push(
    Credentials({
      id: "dev-credentials",
      name: "Dev account",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        resetOnboarding: { label: "Reset onboarding", type: "text" },
      },
      async authorize(credentials) {
        const expectedPassword = process.env.DEV_AUTH_PASSWORD ?? "password";
        const password = String(credentials?.password ?? "");
        const resetOnboarding = credentials?.resetOnboarding === "true";

        if (password !== expectedPassword) {
          return null;
        }

        const email = String(
          credentials?.email ?? process.env.DEV_AUTH_EMAIL ?? "dev@example.com",
        )
          .trim()
          .toLowerCase();

        if (!email) {
          return null;
        }

        const user = await prisma.user.upsert({
          where: { email },
          create: {
            email,
            name: process.env.DEV_AUTH_NAME ?? "Dev User",
          },
          update: resetOnboarding ? { onboardedAt: null } : {},
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          isDemo: false,
        };
      },
    }),
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers,
  trustHost: true,
  session: { strategy: "jwt" },
  // NEXTAUTH_URL may point at production while developing on http://localhost.
  // Force the non-Secure cookie name locally so demo/dev sessions are readable.
  cookies:
    process.env.NODE_ENV === "production"
      ? undefined
      : {
          sessionToken: {
            name: authSessionCookie.name,
            options: authSessionCookie.options,
          },
        },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Manual demo JWTs set `sub` + `id`; keep them aligned for session.user.id.
      if (!token.id && token.sub) {
        token.id = token.sub;
      }

      if (trigger === "update" && typeof session?.onboarded === "boolean") {
        token.onboarded = session.onboarded;
      }

      if (user?.id) {
        token.id = user.id;
        token.isDemo = Boolean(user.isDemo);

        const dbUser = await getUserAuthRow(user.id);
        token.onboarded = Boolean(dbUser?.onboardedAt);
        token.isDemo = Boolean(dbUser?.isDemo);
      }
      if (!token.id && token.email) {
        const dbUser = await getUserAuthRowByEmail(token.email);
        if (dbUser) {
          token.id = dbUser.id;
          token.onboarded = Boolean(dbUser.onboardedAt);
          token.isDemo = Boolean(dbUser.isDemo);
        }
      }

      if (token.id && typeof token.onboarded !== "boolean") {
        const dbUser = await getUserAuthRow(token.id as string);
        token.onboarded = Boolean(dbUser?.onboardedAt);
        if (typeof token.isDemo !== "boolean") {
          token.isDemo = Boolean(dbUser?.isDemo);
        }
      }

      if (token.id && typeof token.isDemo !== "boolean") {
        const dbUser = await getUserAuthRow(token.id as string);
        token.isDemo = Boolean(dbUser?.isDemo);
      }

      return token;
    },
    async session({ session, token }) {
      const id = (token?.id ?? token?.sub) as string | undefined;
      if (id) {
        session.user.id = id;
      }
      session.user.onboarded = Boolean(token?.onboarded);
      session.user.isDemo = Boolean(token?.isDemo);
      return session;
    },
  },
});
