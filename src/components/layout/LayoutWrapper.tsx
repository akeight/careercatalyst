'use client'

import Header from './Header'
import Footer from './Footer'
import React from "react";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <Header />
            <main className="flex-1 p-4">
                {children}
            </main>
            <Footer />
        </div>
    )
}
