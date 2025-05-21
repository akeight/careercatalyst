import type { Metadata } from "next";
import "../styles/globals.css"
import { ThemeProvider } from "next-themes"
import NavBar from "@/components/layout/NavBar";
import Header from "@/components/layout/Header"
//import Sidebar from "@/components/layout/Sidebar"
import Footer from "@/components/layout/Footer"
import React from "react"
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarTrigger, SidebarProvider } from "@/components/ui/sidebar";

config.autoAddCss = false

export const metadata: Metadata = {
    title: "Internship Tracker",
    description: "Track your job search like a beast",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="flex flex-col min-h-screen">
                <Header />
                <div className="flex flex-1 overflow-hidden">
                    <SidebarProvider>
                        <AppSidebar />
                        <main>
                            <SidebarTrigger />
                            {children}
                        </main>
                    </SidebarProvider>
                    <main className="flex-1 overflow-y-auto p-4 bg-muted/40">
                        {children}
                    </main>
                </div>
                <Footer />
            </div>
        </ThemeProvider>
        </body>
        </html>
    );
}
