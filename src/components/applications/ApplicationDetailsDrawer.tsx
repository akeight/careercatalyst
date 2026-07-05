"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ExternalLink, Info, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { trpc } from "@/lib/trpc/client";
import { statusToVariant, type AppStatus } from "@/lib/colors";
import EditApplicationModal from "@/components/applications/EditApplicationModal";
import type { EditApplicationValues } from "@/components/applications/EditApplicationForm";

export type ApplicationDetails = {
  id: string;
  type: "INTERNSHIP" | "FELLOWSHIP" | "EARLY_CAREER";
  title: string;
  companyId: string;
  companyName: string;
  location?: string | null;
  status: AppStatus;
  source?: string | null;
  jobUrl?: string | null;
  notes?: string | null;
  appliedAt?: string | Date | null;
  deadline?: string | Date | null;
  favorite?: boolean;
  createdAt?: string | Date | null;
  updatedAt?: string | Date | null;
  contact?: {
    name: string;
    email?: string | null;
    phone?: string | null;
    linkedIn?: string | null;
    role?: string | null;
  } | null;
};

const typeLabels: Record<ApplicationDetails["type"], string> = {
  INTERNSHIP: "Internship",
  FELLOWSHIP: "Fellowship",
  EARLY_CAREER: "Early Career",
};

function formatDate(value?: string | Date | null) {
  if (!value) return "—";
  return format(new Date(value), "MMM dd, yyyy");
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="grid gap-1">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <div className="text-sm">{value || "—"}</div>
    </div>
  );
}

export function ApplicationDetailsDrawer({
  application,
  trigger,
}: {
  application: ApplicationDetails;
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
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
      setOpen(false);
    },
    onError: () => toast.error("Failed to delete application."),
  });

  const editDefaults: EditApplicationValues = {
    type: application.type ?? "INTERNSHIP",
    title: application.title,
    status: application.status,
    location: application.location ?? "",
    source: application.source ?? "",
    jobUrl: application.jobUrl ?? "",
    notes: application.notes ?? "",
    deadline: application.deadline ? new Date(application.deadline) : undefined,
    favorite: application.favorite ?? false,
    companyId: application.companyId ?? "",
    referredByRecruiter: Boolean(application.contact),
    recruiter: application.contact
      ? {
          name: application.contact.name,
          email: application.contact.email ?? undefined,
          phone: application.contact.phone ?? undefined,
          linkedIn: application.contact.linkedIn ?? undefined,
          role: application.contact.role ?? undefined,
        }
      : undefined,
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger ?? (
          <Button variant="link" className="h-auto p-0">
            View details
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-full gap-0 overflow-hidden p-5 sm:max-w-xl">
        <SheetHeader className="shrink-0 border-b p-4 pr-10">
          <SheetTitle className="text-xl">{application.title}</SheetTitle>
          <SheetDescription>
            {application.companyName || "Unknown company"}
          </SheetDescription>
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <Badge variant={statusToVariant[application.status]}>
              {application.status.toLowerCase()}
            </Badge>
            <Badge variant="outline">{typeLabels[application.type]}</Badge>
            {application.favorite && (
              <Badge variant="secondary">Favorite</Badge>
            )}
          </div>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="grid gap-6 px-4 py-4">
            <section className="rounded-lg border p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold">Job posting</h3>
                  <p className="text-xs text-muted-foreground">
                    Open the original listing when it is available.
                  </p>
                </div>
                {application.jobUrl ? (
                  <Button asChild size="sm" variant="outline">
                    <a
                      href={application.jobUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View posting
                      <ExternalLink className="size-3.5" />
                    </a>
                  </Button>
                ) : (
                  <span className="text-sm text-muted-foreground">No link</span>
                )}
              </div>
            </section>

            <section className="grid gap-3">
              <h3 className="text-sm font-semibold">Notes</h3>
              {application.notes?.trim() ? (
                <div className="rounded-lg border bg-muted/20 p-4 text-sm">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      a: ({ ...props }) => (
                        <a
                          {...props}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary underline underline-offset-4"
                        />
                      ),
                      h1: ({ ...props }) => (
                        <h1 {...props} className="mb-2 text-lg font-semibold" />
                      ),
                      h2: ({ ...props }) => (
                        <h2
                          {...props}
                          className="mb-2 text-base font-semibold"
                        />
                      ),
                      h3: ({ ...props }) => (
                        <h3 {...props} className="mb-1 text-sm font-semibold" />
                      ),
                      p: ({ ...props }) => (
                        <p {...props} className="mb-2 last:mb-0" />
                      ),
                      ul: ({ ...props }) => (
                        <ul
                          {...props}
                          className="mb-2 list-disc space-y-1 pl-5"
                        />
                      ),
                      ol: ({ ...props }) => (
                        <ol
                          {...props}
                          className="mb-2 list-decimal space-y-1 pl-5"
                        />
                      ),
                      li: ({ ...props }) => <li {...props} className="pl-1" />,
                      blockquote: ({ ...props }) => (
                        <blockquote
                          {...props}
                          className="border-l-2 pl-3 text-muted-foreground"
                        />
                      ),
                      code: ({ ...props }) => (
                        <code
                          {...props}
                          className="rounded bg-muted px-1 py-0.5 text-xs"
                        />
                      ),
                    }}
                  >
                    {application.notes}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-lg border p-4 text-sm text-muted-foreground">
                  <Info className="size-4" />
                  No notes yet.
                </div>
              )}
            </section>

            <section className="grid gap-4 sm:grid-cols-2">
              <DetailRow
                label="Date applied"
                value={formatDate(application.appliedAt)}
              />
              <DetailRow
                label="Deadline"
                value={formatDate(application.deadline)}
              />
              <DetailRow label="Location" value={application.location || "—"} />
              <DetailRow label="Source" value={application.source || "—"} />
              <DetailRow
                label="Created"
                value={formatDate(application.createdAt)}
              />
              <DetailRow
                label="Updated"
                value={formatDate(application.updatedAt)}
              />
            </section>

            {application.contact && (
              <section className="grid gap-3 rounded-lg border p-4">
                <h3 className="text-sm font-semibold">Recruiter / Contact</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <DetailRow label="Name" value={application.contact.name} />
                  <DetailRow
                    label="Role"
                    value={application.contact.role || "—"}
                  />
                  <DetailRow
                    label="Email"
                    value={
                      application.contact.email ? (
                        <a
                          href={`mailto:${application.contact.email}`}
                          className="text-primary hover:underline"
                        >
                          {application.contact.email}
                        </a>
                      ) : (
                        "—"
                      )
                    }
                  />
                  <DetailRow
                    label="Phone"
                    value={
                      application.contact.phone ? (
                        <a
                          href={`tel:${application.contact.phone}`}
                          className="text-primary hover:underline"
                        >
                          {application.contact.phone}
                        </a>
                      ) : (
                        "—"
                      )
                    }
                  />
                  <DetailRow
                    label="LinkedIn"
                    value={
                      application.contact.linkedIn ? (
                        <a
                          href={application.contact.linkedIn}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:underline"
                        >
                          Profile
                          <ExternalLink className="size-3.5" />
                        </a>
                      ) : (
                        "—"
                      )
                    }
                  />
                </div>
              </section>
            )}
          </div>
        </div>

        <SheetFooter className="shrink-0 border-t bg-background">
          <div className="mx-auto flex w-full max-w-md flex-col gap-2 sm:flex-row">
            <EditApplicationModal
              applicationId={application.id}
              defaultValues={editDefaults}
              trigger={
                <Button variant="outline" className="w-full">
                  Edit
                </Button>
              }
            />
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => setConfirmOpen(true)}
            >
              <Trash2 className="size-4" />
              Delete
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete application?</DialogTitle>
            <DialogDescription>
              This will permanently delete <strong>{application.title}</strong>
              {application.companyName ? ` at ${application.companyName}` : ""}.
              This action cannot be undone.
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
              onClick={() => deleteMutation.mutate({ id: application.id })}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sheet>
  );
}
