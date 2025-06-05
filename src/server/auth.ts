// src/server/auth.ts

import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github"; // or any provider

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Add user ID to session
      session.user.id = token.sub!;
      return session;
    },
  },
};
