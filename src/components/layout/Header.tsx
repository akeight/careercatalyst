'use client'

export default function Header() {
    return (
        <footer className="w-full border-t py-4 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Internship Tracker · Built with ShadCN UI
        </footer>
    )
}
