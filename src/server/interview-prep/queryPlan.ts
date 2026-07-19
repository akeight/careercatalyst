import type { ResearchMode } from "./limits";
import type { RoleFamilyValue } from "@/lib/roleFamily";

function extractDomain(website?: string | null): string | null {
  if (!website) return null;
  try {
    return new URL(website).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

export function buildQueryPlan(args: {
  mode: ResearchMode;
  companyName: string;
  companyWebsite?: string | null;
  title: string;
  roleFamily: RoleFamilyValue;
  mobileSpecialization?: string | null;
  /** When true, prioritize news/blog over generic about (Snapshot already exists). */
  upgradingFromSnapshot?: boolean;
}): string[] {
  const {
    mode,
    companyName,
    companyWebsite,
    title,
    roleFamily,
    upgradingFromSnapshot = false,
  } = args;
  const domainHint = extractDomain(companyWebsite);

  const officialAbout = [
    `${companyName} official website about`,
    `${companyName} products customers`,
    domainHint
      ? `site:${domainHint} careers OR about OR mission`
      : `${companyName} careers company values`,
  ];

  if (mode === "SNAPSHOT") {
    return [...officialAbout, `${companyName} ${title} internship`].slice(0, 4);
  }

  const roleLens: Record<RoleFamilyValue, string> = {
    SOFTWARE_ENGINEERING: `${companyName} engineering blog OR technology OR infrastructure`,
    FRONTEND_ENGINEERING: `${companyName} frontend OR design system OR web product`,
    MOBILE_DEVELOPMENT: `${companyName} mobile app OR iOS OR Android`,
    UX_UI_PRODUCT_DESIGN: `${companyName} design system OR UX OR product design`,
    PRODUCT_MANAGEMENT: `${companyName} product strategy OR customers OR market`,
    OTHER: `${companyName} ${title} role`,
  };

  const newsAndBlog = domainHint
    ? [
        `site:${domainHint} (newsroom OR news OR press OR blog)`,
        `site:${domainHint} (engineering OR tech OR developers) (blog OR articles)`,
        roleLens[roleFamily],
        `${companyName} newsroom OR press release 2025 OR 2026`,
        `${companyName} (funding OR launch OR acquisition) site:techcrunch.com OR site:reuters.com`,
      ]
    : [
        `${companyName} newsroom OR news OR press OR blog`,
        `${companyName} engineering blog OR tech blog OR developer blog`,
        roleLens[roleFamily],
        `${companyName} newsroom OR press release 2025 OR 2026`,
        `${companyName} (funding OR launch OR acquisition) site:techcrunch.com OR site:reuters.com`,
      ];

  const roleTitle = `${companyName} ${title}`;

  // When upgrading from Snapshot, company overview already exists — prioritize news/blogs.
  const ordered = upgradingFromSnapshot
    ? [...newsAndBlog, roleTitle, ...officialAbout]
    : [...officialAbout, ...newsAndBlog, roleTitle];

  return ordered.slice(0, 10);
}
