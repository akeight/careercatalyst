import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      onboarded?: boolean;
      isDemo?: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    isDemo?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    onboarded?: boolean;
    isDemo?: boolean;
  }
}
