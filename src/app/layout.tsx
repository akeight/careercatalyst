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
                <div className="flex min-h-screen w-full">

                    {/* Sidebar */}
                    <AppSidebar />

                    {/* Main Content */}
                    <div className="flex flex-col flex-1 w-full">
                        <ClientHeader />

                        <main className="flex-1 w-full px-6 py-4">
                            <SidebarTrigger />
                            {children}
                        </main>

                        <Footer />
                    </div>
                </div>
            </SidebarProvider>
        </ThemeProvider>
        </body>
        </html>
    )
}
