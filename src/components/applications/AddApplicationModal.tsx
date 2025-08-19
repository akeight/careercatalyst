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
import { AddApplicationForm } from "./AddApplicationForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@awesome.me/kit-3cb9aa7d8b/icons/chisel/regular";

export default function AddApplicationModal({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-muted">
          <FontAwesomeIcon icon={faPlus} size="lg" />
          Add Internship
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Internship</DialogTitle>
        </DialogHeader>
        <AddApplicationForm userId={userId} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
