"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@awesome.me/kit-3cb9aa7d8b/icons/chisel/regular";
import { ContactForm } from "./ContactForm";
import type { ContactFormValues } from "@/lib/validations/ContactFormSchema";

export default function EditContactModal({
  contactId,
  defaultValues,
  trigger,
}: {
  contactId: string;
  defaultValues: Partial<ContactFormValues>;
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-muted">
            <FontAwesomeIcon icon={faPencil} size="lg" />
            Edit Contact
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Contact</DialogTitle>
        </DialogHeader>
        <ContactForm
          contactId={contactId}
          defaultValues={defaultValues}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
