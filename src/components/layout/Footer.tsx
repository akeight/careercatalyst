"use client";

export default function Footer() {
  return (
    <footer className="w-full max-h-1/5 border-t p-5 text-center text-sm text-muted-foreground sticky border-border/20">
      © {new Date().getFullYear()} Internship Tracker · Built with ShadCN UI
    </footer>
  );
}
