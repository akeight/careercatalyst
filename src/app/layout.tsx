import { Metadata } from "next";
import ClientHeader from "../components/layout/ClientHeader";
import Footer from "../components/layout/Footer";
import React from "react";
import "@/styles/globals.css";
import { Providers } from "@/components/Providers";
//import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "Internship Tracker",
  description: "Track your job search like a beast",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <div className="min-h-screen w-full">
            <ClientHeader />
            <main className="flex-1 px-6 py-4">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
