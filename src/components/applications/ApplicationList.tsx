// components/ApplicationList.tsx
"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";

export default function ApplicationList() {
  const utils = trpc.useUtils();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const apps = trpc.application.getAll.useQuery();

  const deleteApp = trpc.application.delete.useMutation({
    onSuccess: () => {
      utils.application.getAll.invalidate();
      utils.application.getFavorites.invalidate();
      utils.application.getStats.invalidate();
      utils.application.getUpcomingDeadlines.invalidate();
      toast.success("Application deleted.");
      setPendingId(null);
    },
    onError: () => toast.error("Failed to delete application."),
  });

  if (apps.isLoading) return <p>Loading...</p>;
  if (apps.error) return <p>Error: {apps.error.message}</p>;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {apps.data?.map((app) => (
        <Card key={app.id}>
          <CardHeader>
            <CardTitle className="text-lg">
              {app.title}{" "}
              <span className="text-muted-foreground text-sm font-normal">
                @ {app.company?.name ?? "Unknown Company"}
              </span>
            </CardTitle>
            <Badge variant="outline" className="capitalize mt-2">
              {app.status.toLowerCase()}
            </Badge>
          </CardHeader>

          <CardContent className="space-y-1 text-sm">
            {app.location && (
              <p>
                <strong>Location:</strong> {app.location}
              </p>
            )}
            {app.deadline && (
              <p>
                <strong>Deadline:</strong>{" "}
                {format(new Date(app.deadline), "MMM dd, yyyy")}
              </p>
            )}
            {app.contact && (
              <div className="mt-2 space-y-1">
                <p>
                  <strong>Recruiter:</strong> {app.contact.name}
                </p>
                {app.contact.email && <p>Email: {app.contact.email}</p>}
                {app.contact.phone && <p>Phone: {app.contact.phone}</p>}
                {app.contact.linkedIn && (
                  <a
                    href={app.contact.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    LinkedIn
                  </a>
                )}
              </div>
            )}
          </CardContent>

          <CardFooter>
            <button
              onClick={() => setPendingId(app.id)}
              className="text-red-600 hover:underline text-sm"
            >
              Delete
            </button>
          </CardFooter>
        </Card>
      ))}

      <Dialog
        open={pendingId !== null}
        onOpenChange={(open) => !open && setPendingId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete application?</DialogTitle>
            <DialogDescription>
              This will permanently delete this application. This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPendingId(null)}
              disabled={deleteApp.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => pendingId && deleteApp.mutate({ id: pendingId })}
              disabled={deleteApp.isPending}
            >
              {deleteApp.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
