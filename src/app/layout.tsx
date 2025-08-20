import { Metadata } from "next";
import ClientHeader from "../components/layout/ClientHeader";
import Footer from "../components/layout/Footer";
import React from "react";
import "@/styles/globals.css";
import { Providers } from "@/components/Providers";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Toaster } from "@/components/ui/sonner";

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
          <SidebarProvider>
            <div className="flex">
              <AppSidebar />
              <SidebarTrigger className="m-3" />
            </div>

            <div className=" w-full">
              <ClientHeader />
              <main className="flex center justify-center items-start px-5 py-10">
                {children}
                <Toaster
                  position="top-center"
                  richColors
                  closeButton
                  expand
                  theme="system"
                  duration={3500}
                />
              </main>
              <Footer />
            </div>
          </SidebarProvider>
        </Providers>
      </body>
    </html>
  );
}
