import { Metadata } from "next";
import React from "react";
import "@/styles/globals.css";
import { ThemeProviders } from "@/components/ThemeProviders";

export const metadata: Metadata = {
  title: "Internship Tracker",
  description: "Track your job search like a pro",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProviders>{children}</ThemeProviders>
      </body>
    </html>
  );
}
