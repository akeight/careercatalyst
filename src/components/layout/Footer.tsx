"use client";

export default function Footer() {
  return (
    <footer className="w-full border-t border-border/20 bg-background p-5 text-center text-sm text-muted-foreground">
      © {new Date().getFullYear()} Internship Tracker · Built for students by
      students
    </footer>
  );
}
