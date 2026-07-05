import type { BadgeVariant } from "@/lib/colors";

export const ContactType = {
  RECRUITER: "RECRUITER",
  REFERRAL: "REFERRAL",
  CONNECTION: "CONNECTION",
  MENTOR: "MENTOR",
  HIRING_MANAGER: "HIRING_MANAGER",
  OTHER: "OTHER",
} as const;

export const contactTypeValues = [
  ContactType.RECRUITER,
  ContactType.REFERRAL,
  ContactType.CONNECTION,
  ContactType.MENTOR,
  ContactType.HIRING_MANAGER,
  ContactType.OTHER,
] as const;

export type ContactType = (typeof contactTypeValues)[number];

export const contactTypeLabels: Record<ContactType, string> = {
  RECRUITER: "Recruiter",
  REFERRAL: "Referral",
  CONNECTION: "Connection",
  MENTOR: "Mentor",
  HIRING_MANAGER: "Hiring Manager",
  OTHER: "Other",
};

export const contactTypeVariant: Record<ContactType, BadgeVariant> = {
  RECRUITER: "default",
  REFERRAL: "secondary",
  CONNECTION: "outline",
  MENTOR: "secondary",
  HIRING_MANAGER: "default",
  OTHER: "outline",
};
