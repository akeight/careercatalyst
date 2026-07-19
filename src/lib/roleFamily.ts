export const ROLE_FAMILY_VALUES = [
  "SOFTWARE_ENGINEERING",
  "FRONTEND_ENGINEERING",
  "MOBILE_DEVELOPMENT",
  "UX_UI_PRODUCT_DESIGN",
  "PRODUCT_MANAGEMENT",
  "OTHER",
] as const;

export type RoleFamilyValue = (typeof ROLE_FAMILY_VALUES)[number];

export const MOBILE_SPECIALIZATION_VALUES = [
  "IOS",
  "ANDROID",
  "CROSS_PLATFORM",
  "NOT_SPECIFIED",
] as const;

export type MobileSpecializationValue =
  (typeof MOBILE_SPECIALIZATION_VALUES)[number];

export const ROLE_FAMILY_LABELS: Record<RoleFamilyValue, string> = {
  SOFTWARE_ENGINEERING: "Software Engineering",
  FRONTEND_ENGINEERING: "Frontend Engineering",
  MOBILE_DEVELOPMENT: "Mobile Development",
  UX_UI_PRODUCT_DESIGN: "UX/UI or Product Design",
  PRODUCT_MANAGEMENT: "Product Management",
  OTHER: "Other",
};

export const MOBILE_SPECIALIZATION_LABELS: Record<
  MobileSpecializationValue,
  string
> = {
  IOS: "iOS",
  ANDROID: "Android",
  CROSS_PLATFORM: "Cross-platform",
  NOT_SPECIFIED: "Not specified",
};

/** Keyword heuristic — suggestion only; user must confirm. */
export function suggestRoleFamily(
  title: string,
  jobDescription?: string | null,
): RoleFamilyValue {
  const text = `${title} ${jobDescription ?? ""}`.toLowerCase();

  if (
    /\b(product\s*manager|product\s*management|\bpm\b)\b/.test(text) &&
    !/\b(engineer|developer|designer)\b/.test(title.toLowerCase())
  ) {
    return "PRODUCT_MANAGEMENT";
  }
  if (
    /\b(ux|ui|product\s*design|interaction\s*design|visual\s*design)\b/.test(
      text,
    )
  ) {
    return "UX_UI_PRODUCT_DESIGN";
  }
  if (
    /\b(ios|android|mobile|react\s*native|flutter|swift|kotlin)\b/.test(text)
  ) {
    return "MOBILE_DEVELOPMENT";
  }
  if (
    /\b(frontend|front-end|front\s*end|react|vue|angular|css|html)\b/.test(text)
  ) {
    return "FRONTEND_ENGINEERING";
  }
  if (
    /\b(software|backend|back-end|full[\s-]?stack|engineer|developer|swe)\b/.test(
      text,
    )
  ) {
    return "SOFTWARE_ENGINEERING";
  }
  return "OTHER";
}

export function suggestMobileSpecialization(
  title: string,
  jobDescription?: string | null,
): MobileSpecializationValue {
  const text = `${title} ${jobDescription ?? ""}`.toLowerCase();
  if (/\bios\b|\bswift\b|\bswiftui\b/.test(text) && !/\bandroid\b/.test(text)) {
    return "IOS";
  }
  if (/\bandroid\b|\bkotlin\b/.test(text) && !/\bios\b/.test(text)) {
    return "ANDROID";
  }
  if (/\breact\s*native\b|\bflutter\b|\bcross[\s-]?platform\b/.test(text)) {
    return "CROSS_PLATFORM";
  }
  return "NOT_SPECIFIED";
}
