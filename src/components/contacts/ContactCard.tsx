"use client";

import { ExternalLink, Mail, Phone, UserRound } from "lucide-react";

import { LinkedinIcon } from "@/components/icons/LinkedinIcon";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  contactTypeLabels,
  contactTypeVariant,
  type ContactType,
} from "@/lib/contactTypes";

export type ContactCardContact = {
  id?: string;
  name: string;
  type?: ContactType | null;
  title?: string | null;
  role?: string | null;
  companyName?: string | null;
  email?: string | null;
  phone?: string | null;
  linkedIn?: string | null;
  notes?: string | null;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function ContactCard({
  contact,
  compact = false,
}: {
  contact: ContactCardContact;
  compact?: boolean;
}) {
  const title = contact.title || contact.role;
  const subtitle = [title, contact.companyName].filter(Boolean).join(" at ");

  return (
    <Card className={compact ? "gap-3 p-4" : "gap-4 p-0"}>
      <CardHeader className={compact ? "px-0" : "px-5 pt-5"}>
        <div className="flex items-start gap-3">
          <Avatar className="size-11 border">
            <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
              {getInitials(contact.name) || <UserRound className="size-4" />}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="truncate text-base">
                {contact.name}
              </CardTitle>
              {contact.type && (
                <Badge variant={contactTypeVariant[contact.type]}>
                  {contactTypeLabels[contact.type]}
                </Badge>
              )}
            </div>
            {subtitle && (
              <CardDescription className="mt-1">{subtitle}</CardDescription>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent
        className={compact ? "space-y-3 px-0" : "space-y-4 px-5 pb-5"}
      >
        <div className="flex flex-wrap gap-2">
          {contact.email && (
            <Button asChild variant="outline" size="sm">
              <a href={`mailto:${contact.email}`}>
                <Mail className="size-3.5" />
                Email
              </a>
            </Button>
          )}
          {contact.phone && (
            <Button asChild variant="outline" size="sm">
              <a href={`tel:${contact.phone}`}>
                <Phone className="size-3.5" />
                Call
              </a>
            </Button>
          )}
          {contact.linkedIn && (
            <Button asChild variant="outline" size="sm">
              <a
                href={contact.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedinIcon className="size-3.5" />
                LinkedIn
                <ExternalLink className="size-3" />
              </a>
            </Button>
          )}
          {!contact.email && !contact.phone && !contact.linkedIn && (
            <span className="text-sm text-muted-foreground">
              No contact methods saved yet.
            </span>
          )}
        </div>

        {contact.notes && (
          <p className="rounded-lg bg-muted/40 p-3 text-sm text-muted-foreground">
            {contact.notes}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
