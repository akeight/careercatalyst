// components/applications/AddInternshipModal.tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EditApplicationForm } from "./EditApplicationForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@awesome.me/kit-3cb9aa7d8b/icons/chisel/regular";
import { EditApplicationSchema } from "@/lib/validations/EditApplicationSchema";
import { z } from "zod";

export default function EditApplicationModal({
  applicationId,
  defaultValues,
}: {
  applicationId: string;
  defaultValues: z.infer<typeof EditApplicationSchema>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-muted">
          <FontAwesomeIcon icon={faPencil} size="lg" />
          Edit Internship
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Internship</DialogTitle>
        </DialogHeader>
        <EditApplicationForm
          open={open}
          onClose={() => setOpen(false)}
          applicationId={applicationId}
          defaultValues={defaultValues}
        />
      </DialogContent>
    </Dialog>
  );
}
