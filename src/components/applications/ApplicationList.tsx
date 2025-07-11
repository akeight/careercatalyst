// components/ApplicationList.tsx
"use client";

import { trpc } from "@/lib/trpc/client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function ApplicationList() {
  const utils = trpc.useUtils();

  const apps = trpc.application.getAll.useQuery();

  const deleteApp = trpc.application.delete.useMutation({
    onSuccess: () => {
      utils.application.getAll.invalidate();
    },
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
              onClick={() => deleteApp.mutate({ id: app.id })}
              className="text-red-600 hover:underline text-sm"
            >
              Delete
            </button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
