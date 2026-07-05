// src/server/auth.ts
import NextAuth from "next-auth";
import type { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import LinkedIn from "next-auth/providers/linkedin";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const providers: Provider[] = [];

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
        };
      },
    }),
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers,
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && typeof session?.onboarded === "boolean") {
        token.onboarded = session.onboarded;
      }

      if (user) {
        token.id = user.id; // 👈 ensure token gets user ID

        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { onboardedAt: true },
        });

        token.onboarded = Boolean(dbUser?.onboardedAt);
      }

      if (!token.id && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { id: true, onboardedAt: true },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.onboarded = Boolean(dbUser.onboardedAt);
        }
      }

      if (token.id && typeof token.onboarded !== "boolean") {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { onboardedAt: true },
        });

        token.onboarded = Boolean(dbUser?.onboardedAt);
      }

      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string;
      }
      session.user.onboarded = Boolean(token?.onboarded);
      return session;
    },
  },
});
