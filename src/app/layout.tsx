import { Metadata } from "next"
import { ThemeProvider } from "next-themes"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/AppSidebar"
import ClientHeader from "@/components/layout/ClientHeader"
import Footer from "@/components/layout/Footer"
import React from "react";
import "@/styles/globals.css"


export const metadata: Metadata = {
    title: "Internship Tracker",
    description: "Track your job search like a beast",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <SidebarProvider>
                <div className="min-h-screen w-full">
                    {/* HEADER OUTSIDE FLEX */}
                    <ClientHeader />

                    <div className="flex">
                        {/* Sidebar */}
                        <AppSidebar />

                        {/* Main */}
                        <main className="flex-1 px-6 py-4">
                            <SidebarTrigger />
                            {children}
                        </main>
                    </div>

                    <Footer />
                </div>
            </SidebarProvider>
        </ThemeProvider>
        </body>
        </html>
    )
}
