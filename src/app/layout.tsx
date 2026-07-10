import { Metadata } from "next";
import React from "react";
import { Aleo, Host_Grotesk } from "next/font/google";
import "@/styles/globals.css";
import { ThemeProviders } from "@/components/ThemeProviders";

const aleo = Aleo({
  subsets: ["latin"],
  weight: ["300"],
  variable: "--font-aleo",
  display: "swap",
});

const hostGrotesk = Host_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-host",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Catalyst",
  description: "Built for internship season.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${aleo.variable} ${hostGrotesk.variable}`}>
        <ThemeProviders>{children}</ThemeProviders>
      </body>
    </html>
  );
}
