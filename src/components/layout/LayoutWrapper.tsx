'use client'

import { ThemeProvider } from "next-themes"
import Header from './Header'
import Footer from './Footer'
import React from "react"
import Sidebar from './Sidebar'
//import NavBar from './NavBar'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col">
            <ThemeProvider attribute="class">
                {children}
            </ThemeProvider>
            <Header />
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 p-4 bg-muted">
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    );
}
