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
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { cn } from "@/lib/utils/utils";

type AddApplicationModalProps = {
  userId: string;
  iconOnly?: boolean;
  triggerClassName?: string;
};

export default function AddApplicationModal({
  userId,
  iconOnly = false,
  triggerClassName,
}: AddApplicationModalProps) {
  const [open, setOpen] = useState(false);
  const trigger = (
    <button
      type="button"
      className={cn(
        "flex w-full items-center gap-2 px-4 py-2 hover:bg-muted",
        iconOnly && "size-10 justify-center rounded-md p-0",
        triggerClassName,
      )}
      aria-label={iconOnly ? "Add Internship" : undefined}
      title={iconOnly ? "Add Internship" : undefined}
    >
      <FontAwesomeIcon icon={faPlus} size={iconOnly ? "xl" : "lg"} />
      {!iconOnly && <span>Add Internship</span>}
    </button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {iconOnly ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
          </TooltipTrigger>
          <TooltipContent side="right">Add Internship</TooltipContent>
        </Tooltip>
      ) : (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      )}
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Internship</DialogTitle>
        </DialogHeader>
        <AddApplicationForm userId={userId} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
