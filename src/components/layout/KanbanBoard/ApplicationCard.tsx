"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import React from "react";
import type { Application } from "@/store/useTrackerStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPencil,
} from "@awesome.me/kit-3cb9aa7d8b/icons/chisel/regular";
import { trpc } from "@/lib/trpc/client";
import { toast } from "sonner";
import { statusBadgeStyle, cssColorForStatus } from "@/lib/colors";
import EditApplicationModal from "@/components/applications/EditApplicationModal";
import type { EditApplicationValues } from "@/components/applications/EditApplicationForm";
import { ApplicationDetailsDrawer } from "@/components/applications/ApplicationDetailsDrawer";

type ApplicationCardProps = {
  app: Application;
};

export default function ApplicationCard({ app }: ApplicationCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const utils = trpc.useUtils();

  const deleteMutation = trpc.application.delete.useMutation({
    onSuccess: () => {
      utils.application.getAll.invalidate();
      utils.application.getFavorites.invalidate();
      utils.application.getStats.invalidate();
      utils.application.getUpcomingDeadlines.invalidate();
      toast.success("Application deleted.");
      setConfirmOpen(false);
    },
    onError: () => toast.error("Failed to delete application."),
  });

  const stopDrag = (e: React.SyntheticEvent) => {
    e.stopPropagation();
  };

  const editDefaults: EditApplicationValues = {
    type: app.type ?? "INTERNSHIP",
    title: app.title,
    status: app.status,
    location: app.location ?? "",
    source: app.source ?? "",
    jobUrl: app.jobUrl ?? "",
    notes: app.notes ?? "",
    deadline: app.deadline ? new Date(app.deadline) : undefined,
    favorite: app.favorite ?? false,
    companyId: app.companyId ?? app.company?.id ?? "",
    contactId: app.contactId ?? app.contact?.id ?? "",
  };

  return (
    <div className="border-left-primary- *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card dark:*:data-[slot=card]:bg-none lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card
        className="w-49 h-35 mb-0.5 my-1.5 shadow-2xs"
        style={{
          borderLeft: `6px solid ${cssColorForStatus(app.status)}`,
        }}
      >
        <CardHeader>
          <CardTitle className="font-small font-sans text-foreground">
            {app.title}
          </CardTitle>
          <Badge
            style={statusBadgeStyle(app.status)}
            className="border-transparent text-[11px] px-1.75 py-0.75"
          >
            {app.status}
          </Badge>
        </CardHeader>
        <CardContent className="text-[12px] flex items-center justify-between font-sans">
          {app.company?.name && (
            <p>
              <strong>{app.company.name}</strong>
            </p>
          )}

          <div className="flex items-center gap-3">
            <ApplicationDetailsDrawer
              application={{
                id: app.id,
                type: app.type ?? "INTERNSHIP",
                title: app.title,
                companyId: app.companyId ?? app.company?.id ?? "",
                companyName: app.company?.name ?? "Unknown company",
                location: app.location,
                status: app.status,
                source: app.source,
                jobUrl: app.jobUrl,
                notes: app.notes,
                appliedAt: app.appliedAt,
                deadline: app.deadline,
                favorite: app.favorite,
                createdAt: app.createdAt,
                updatedAt: app.updatedAt,
                contact: app.contact
                  ? {
                      id: app.contact.id,
                      name: app.contact.name,
                      type: app.contact.type,
                      title: app.contact.title,
                      email: app.contact.email,
                      phone: app.contact.phone,
                      linkedIn: app.contact.linkedIn,
                      role: app.contact.role,
                      notes: app.contact.notes,
                      companyName: app.contact.company?.name,
                    }
                  : null,
              }}
              trigger={
                <button
                  aria-label="View application details"
                  onClick={stopDrag}
                  onPointerDown={stopDrag}
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                  className="text-[11px] font-medium text-primary hover:underline"
                >
                  Details
                </button>
              }
            />

            <EditApplicationModal
              applicationId={app.id}
              defaultValues={editDefaults}
              trigger={
                <button
                  aria-label="Edit application"
                  onClick={stopDrag}
                  onPointerDown={stopDrag}
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <FontAwesomeIcon icon={faPencil} size="lg" />
                </button>
              }
            />

            <button
              aria-label="Delete application"
              onClick={(e) => {
                stopDrag(e);
                setConfirmOpen(true);
              }}
              onPointerDown={stopDrag}
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
              className="text-muted-foreground hover:text-destructive"
            >
              <FontAwesomeIcon icon={faTrash} size="lg" />
            </button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete application?</DialogTitle>
            <DialogDescription>
              This will permanently delete <strong>{app.title}</strong>
              {app.company?.name ? ` at ${app.company.name}` : ""}. This action
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
              onClick={() => deleteMutation.mutate({ id: app.id })}
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
