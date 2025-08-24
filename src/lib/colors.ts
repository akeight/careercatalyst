// lib/colors.ts
import { VariantProps } from "class-variance-authority";
import { badgeVariants } from "@/components/ui/badge";

// If you have a Status enum/string union, import it instead of `string`
export type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];
export type AppStatus =
  | "SAVED"
  | "APPLIED"
  | "INTERVIEW"
  | "PENDING"
  | "OFFER"
  | "REJECTED";

// 1) Status -> Badge variant (UI semantics)
export const statusToVariant: Record<AppStatus, BadgeVariant> = {
  SAVED: "secondary",
  APPLIED: "default",
  INTERVIEW: "outline",
  PENDING: "secondary",
  OFFER: "destructive",
  REJECTED: "default",
};

// 2) Badge variant -> theme token (CSS var that actually exists)
export const variantToToken: Record<NonNullable<BadgeVariant>, string> = {
  default: "primary",
  secondary: "secondary",
  destructive: "destructive",
  outline: "border",
};

// 3) Helper to get a CSS color value for inline styles
// Return the CSS variable directly since your variables already contain oklch values
export function cssColorForVariant(variant: NonNullable<BadgeVariant>) {
  const token = variantToToken[variant];
  return `var(--${token})`;
}

// Optional convenience: go straight from status -> CSS color
export function cssColorForStatus(status: AppStatus) {
  const variant = statusToVariant[status];
  if (!variant) return "var(--muted)"; // fallback color
  return cssColorForVariant(variant);
}
