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
import EditApplicationModal from "@/components/applications/EditApplicationModal";
import type { EditApplicationValues } from "@/components/applications/EditApplicationForm";
import type { FavoriteRow } from "./columns";

export function FavoriteRowActions({ row }: { row: FavoriteRow }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const utils = trpc.useUtils();

  const deleteMutation = trpc.application.delete.useMutation({
    onSuccess: () => {
      utils.application.getAll.invalidate();
      utils.application.getFavorites.invalidate();
      utils.application.getSaved.invalidate();
      utils.application.getStats.invalidate();
      utils.application.getUpcomingDeadlines.invalidate();
      toast.success("Application deleted.");
      setConfirmOpen(false);
    },
    onError: () => toast.error("Failed to delete application."),
  });

  const editDefaults: EditApplicationValues = {
    type: row.type ?? "INTERNSHIP",
    title: row.title,
    status: row.status,
    location: row.location ?? "",
    source: row.source ?? "",
    jobUrl: row.jobUrl ?? "",
    deadline: row.deadline ? new Date(row.deadline) : undefined,
    favorite: row.favorite ?? false,
    companyId: row.companyId ?? "",
    referredByRecruiter: Boolean(row.contact),
    recruiter: row.contact
      ? {
          name: row.contact.name,
          email: row.contact.email ?? undefined,
          phone: row.contact.phone ?? undefined,
          linkedIn: row.contact.linkedIn ?? undefined,
          role: row.contact.role ?? undefined,
        }
      : undefined,
  };

  return (
    <div className="flex items-center gap-3">
      <EditApplicationModal
        applicationId={row.id}
        defaultValues={editDefaults}
        trigger={
          <button
            aria-label="Edit application"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <FontAwesomeIcon icon={faPencil} size="lg" />
          </button>
        }
      />

      <button
        aria-label="Delete application"
        onClick={() => setConfirmOpen(true)}
        className="text-muted-foreground transition-colors hover:text-destructive"
      >
        <FontAwesomeIcon icon={faTrash} size="lg" />
      </button>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete application?</DialogTitle>
            <DialogDescription>
              This will permanently delete <strong>{row.title}</strong>
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
