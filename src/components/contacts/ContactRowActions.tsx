"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPencil,
} from "@awesome.me/kit-3cb9aa7d8b/icons/chisel/regular";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc/client";
import EditContactModal from "./EditContactModal";
import type { ContactRow } from "./columns";

export function ContactRowActions({ row }: { row: ContactRow }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const utils = trpc.useUtils();

  const deleteMutation = trpc.contact.delete.useMutation({
    onSuccess: () => {
      utils.contact.getAll.invalidate();
      toast.success("Contact deleted.");
      setConfirmOpen(false);
    },
    onError: () => toast.error("Failed to delete contact."),
  });

  const editDefaults = {
    name: row.name,
    type: row.type ?? undefined,
    title: row.title ?? "",
    email: row.email ?? "",
    phone: row.phone ?? "",
    linkedIn: row.linkedIn ?? "",
    notes: row.notes ?? "",
    companyId: row.companyId ?? "",
  };

  return (
    <div className="flex items-center gap-3">
      <EditContactModal
        contactId={row.id}
        defaultValues={editDefaults}
        trigger={
          <button
            aria-label="Edit contact"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <FontAwesomeIcon icon={faPencil} size="lg" />
          </button>
        }
      />

      <button
        aria-label="Delete contact"
        onClick={() => setConfirmOpen(true)}
        className="text-muted-foreground transition-colors hover:text-destructive"
      >
        <FontAwesomeIcon icon={faTrash} size="lg" />
      </button>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete contact?</DialogTitle>
            <DialogDescription>
              This will permanently delete <strong>{row.name}</strong>
              {row.companyName ? ` at ${row.companyName}` : ""}. This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteMutation.mutate({ id: row.id })}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
