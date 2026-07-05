// src/server/auth.ts
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id; // 👈 ensure token gets user ID
        // The adapter returns the full user row, including onboardedAt.
        token.onboarded = Boolean(
          (user as { onboardedAt?: Date | null }).onboardedAt,
        );
      }
      // Refresh flag when the client calls session.update({ onboarded: true }).
      if (trigger === "update" && session?.onboarded) {
        token.onboarded = true;
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
