"use client";

import { forwardRef, useEffect, useState } from "react";
import { useTheme } from "next-themes";

import { Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";

type ThemeToggleProps = Omit<
  React.ComponentProps<typeof Button>,
  "aria-label" | "children"
>;

export const ThemeToggle = forwardRef<HTMLButtonElement, ThemeToggleProps>(
  function ThemeToggle(
    { variant = "outline", size = "icon", onClick, ...props },
    ref,
  ) {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const isDark = resolvedTheme === "dark";

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        {...props}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) {
            setTheme(isDark ? "light" : "dark");
          }
        }}
        aria-label="Toggle theme"
      >
        <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        <span className="sr-only">
          {mounted && isDark ? "Switch to light mode" : "Switch to dark mode"}
        </span>
      </Button>
    );
  },
);
