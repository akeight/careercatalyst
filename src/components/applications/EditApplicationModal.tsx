"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  EditApplicationForm,
  type EditApplicationValues,
} from "./EditApplicationForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@awesome.me/kit-3cb9aa7d8b/icons/chisel/regular";

export default function EditApplicationModal({
  applicationId,
  defaultValues,
  trigger,
}: {
  applicationId: string;
  defaultValues: EditApplicationValues;
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-muted">
            <FontAwesomeIcon icon={faPencil} size="lg" />
            Edit Internship
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Application</DialogTitle>
        </DialogHeader>
        <EditApplicationForm
          applicationId={applicationId}
          defaultValues={defaultValues}
          onClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
