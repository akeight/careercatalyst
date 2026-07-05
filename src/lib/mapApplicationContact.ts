import type { ContactType } from "@/lib/contactTypes";

/** Contact fields returned by application queries at runtime. */
export type ApplicationContactSummary = {
  id: string;
  name: string;
  type?: ContactType | null;
  title?: string | null;
  email?: string | null;
  phone?: string | null;
  linkedIn?: string | null;
  role?: string | null;
  notes?: string | null;
  company?: { name?: string | null } | null;
};

export type MappedApplicationContact = {
  id: string;
  name: string;
  type?: ContactType | null;
  title?: string | null;
  email?: string | null;
  phone?: string | null;
  linkedIn?: string | null;
  role?: string | null;
  notes?: string | null;
  companyName?: string | null;
};

export function mapApplicationContact(
  contact: ApplicationContactSummary | null | undefined,
): MappedApplicationContact | null {
  if (!contact) return null;

  return {
    id: contact.id,
    name: contact.name,
    type: contact.type ?? null,
    title: contact.title ?? null,
    email: contact.email,
    phone: contact.phone,
    linkedIn: contact.linkedIn,
    role: contact.role,
    notes: contact.notes ?? null,
    companyName: contact.company?.name ?? null,
  };
}
