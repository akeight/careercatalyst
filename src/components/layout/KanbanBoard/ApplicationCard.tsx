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
import { Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";
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

  const deadlineLabel = app.deadline
    ? format(new Date(app.deadline), "MMM d")
    : null;

  return (
    <div className="group">
      <Card
        className="w-full gap-2 rounded-lg border-l-4 bg-gradient-to-t from-muted/20 to-card py-3 shadow-xs transition duration-150 hover:-translate-y-0.5 hover:shadow-md"
        style={{
          borderLeftColor: cssColorForStatus(app.status),
        }}
      >
        <CardHeader className="gap-1.5 px-3">
          <CardTitle className="font-sans text-sm leading-snug text-foreground">
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
                  className="text-left hover:underline"
                >
                  {app.title}
                </button>
              }
            />
          </CardTitle>

          <Badge
            style={statusBadgeStyle(app.status)}
            className="w-fit border-transparent px-1.75 py-0.75 text-[11px]"
          >
            {app.status}
          </Badge>
        </CardHeader>

        <CardContent className="flex items-end justify-between gap-2 px-3 font-sans text-xs">
          <div className="flex min-w-0 flex-col gap-1.5">
            {app.company?.name && (
              <p className="truncate font-semibold text-foreground">
                {app.company.name}
              </p>
            )}

            {(deadlineLabel || app.location) && (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground">
                {deadlineLabel && (
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    {deadlineLabel}
                  </span>
                )}
                {app.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3" />
                    {app.location}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2 opacity-70 transition-opacity group-hover:opacity-100">
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
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  <FontAwesomeIcon icon={faPencil} />
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
              className="text-muted-foreground transition-colors hover:text-destructive"
            >
              <FontAwesomeIcon icon={faTrash} />
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
