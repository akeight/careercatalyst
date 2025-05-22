'use client'

import { ThemeProvider } from "next-themes"
import Header from './Header'
import Footer from './Footer'
import React from "react"
import {AppSidebar} from "@/components/layout/AppSidebar";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex">
            <ThemeProvider attribute="class">
                {children}
            </ThemeProvider>
            <Header />
            <div className="">
                <AppSidebar />
                <main className="">
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    );
}
