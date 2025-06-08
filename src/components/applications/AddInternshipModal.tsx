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
import { ApplicationForm } from "./ApplicationForm";
import { Plus } from "lucide-react";

export default function AddInternshipModal({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-muted">
          <Plus size={16} />
          Add Internship
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Internship</DialogTitle>
        </DialogHeader>
        <ApplicationForm userId={userId} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
