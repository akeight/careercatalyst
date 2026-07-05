"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus, UserRound, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ContactForm } from "@/components/contacts/ContactForm";
import { ContactCard } from "@/components/contacts/ContactCard";
import { contactTypeLabels, type ContactType } from "@/lib/contactTypes";
import { trpc } from "@/lib/trpc/client";
import { cn } from "@/lib/utils/utils";

export type ContactComboboxContact = {
  id: string;
  name: string;
  type?: ContactType | null;
  title?: string | null;
  role?: string | null;
  companyId?: string | null;
  company?: {
    name?: string | null;
  } | null;
};

export function ContactCombobox({
  value,
  onChange,
  companyId,
}: {
  value?: string;
  onChange: (contactId: string) => void;
  companyId?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [addOpen, setAddOpen] = React.useState(false);
  const contactsQuery = trpc.contact.getAll.useQuery();

  const contacts: ContactComboboxContact[] = contactsQuery.data ?? [];
  const selectedContact = contacts.find((contact) => contact.id === value);

  return (
    <>
      <div className="grid gap-3">
        <div className="flex gap-2">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="min-w-0 flex-1 justify-between"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <UserRound className="size-4 shrink-0 text-muted-foreground" />
                  <span className="truncate">
                    {selectedContact
                      ? selectedContact.name
                      : "Select a contact"}
                  </span>
                </span>
                <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandInput placeholder="Search contacts..." />
                <CommandList>
                  <CommandEmpty>No contacts found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      value="no-contact"
                      onSelect={() => {
                        onChange("");
                        setOpen(false);
                      }}
                    >
                      <X className="mr-2 size-4 text-muted-foreground" />
                      No linked contact
                      <Check
                        className={cn(
                          "ml-auto size-4",
                          !value ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </CommandItem>
                    {contacts.map((contact) => {
                      const subtitle = [
                        contact.title || contact.role,
                        contact.company?.name,
                      ]
                        .filter(Boolean)
                        .join(" at ");

                      return (
                        <CommandItem
                          key={contact.id}
                          value={`${contact.name} ${subtitle}`}
                          onSelect={() => {
                            onChange(contact.id);
                            setOpen(false);
                          }}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="truncate font-medium">
                                {contact.name}
                              </span>
                              {contact.type && (
                                <Badge variant="outline" className="shrink-0">
                                  {contactTypeLabels[contact.type]}
                                </Badge>
                              )}
                            </div>
                            {subtitle && (
                              <p className="truncate text-xs text-muted-foreground">
                                {subtitle}
                              </p>
                            )}
                          </div>
                          <Check
                            className={cn(
                              "ml-2 size-4",
                              value === contact.id
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                  <CommandGroup>
                    <CommandItem
                      value="add-new-contact"
                      onSelect={() => {
                        setOpen(false);
                        setAddOpen(true);
                      }}
                    >
                      <Plus className="mr-2 size-4" />
                      Add new contact
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onChange("")}
              aria-label="Clear linked contact"
            >
              <X className="size-4" />
            </Button>
          )}
        </div>

        {selectedContact && (
          <ContactCard
            compact
            contact={{
              id: selectedContact.id,
              name: selectedContact.name,
              type: selectedContact.type,
              title: selectedContact.title,
              role: selectedContact.role,
              companyName: selectedContact.company?.name,
            }}
          />
        )}
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Helpful Contact</DialogTitle>
          </DialogHeader>
          <ContactForm
            defaultValues={{ companyId: companyId ?? "" }}
            onSuccess={(contact) => {
              if (contact?.id) {
                onChange(contact.id);
              }
              setAddOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
