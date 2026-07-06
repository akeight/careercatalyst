// lib/colors.ts
import type { CSSProperties } from "react";
import { VariantProps } from "class-variance-authority";
import { badgeVariants } from "@/components/ui/badge";

// If you have a Status enum/string union, import it instead of `string`
export type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];
export type AppStatus =
  | "SAVED"
  | "APPLIED"
  | "INTERVIEW"
  | "OFFER"
  | "REJECTED";

// 1) Status -> dedicated theme token (defined in globals.css, hue-tuned per mode)
const statusToken: Record<AppStatus, string> = {
  SAVED: "status-saved",
  APPLIED: "status-applied",
  INTERVIEW: "status-interview",
  OFFER: "status-offer",
  REJECTED: "status-rejected",
};

// 2) Badge variant -> theme token (kept for non-status badges)
export const variantToToken: Record<NonNullable<BadgeVariant>, string> = {
  default: "primary",
  secondary: "secondary",
  destructive: "destructive",
  outline: "border",
};

// 3) Helper to get a CSS color value for inline styles
export function cssColorForVariant(variant: NonNullable<BadgeVariant>) {
  const token = variantToToken[variant];
  return `var(--${token})`;
}

// 4) Status -> CSS background color (used for kanban borders, charts, etc.)
export function cssColorForStatus(status: AppStatus) {
  const token = statusToken[status];
  if (!token) return "var(--muted)"; // fallback color
  return `var(--${token})`;
}

// 5) Status -> inline style for a colored badge (background + readable text)
export function statusBadgeStyle(status: AppStatus): CSSProperties {
  const token = statusToken[status];
  if (!token) {
    return {
      backgroundColor: "var(--muted)",
      color: "var(--muted-foreground)",
    };
  }
  return {
    backgroundColor: `var(--${token})`,
    color: `var(--${token}-foreground)`,
  };
}
