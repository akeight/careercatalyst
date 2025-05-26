"use client";

export default function Footer() {
  return (
    <footer className="w-full border-t py-4 text-center text-sm text-muted-foreground sticky">
      © {new Date().getFullYear()} Internship Tracker · Built with ShadCN UI
    </footer>
  );
}
