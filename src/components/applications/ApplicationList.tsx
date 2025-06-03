// components/ApplicationList.tsx
"use client";

//import { useEffect } from "react";
import { Trash2, Heart, HeartOff } from "lucide-react";
import { ExternalLink } from "lucide-react";

import { trpc } from "@/lib/trpc/client";

export default function ApplicationList({ userId }: { userId: string }) {
  const utils = trpc.useUtils();

  const apps = trpc.application.getAll.useQuery({ userId });

  const deleteApp = trpc.application.delete.useMutation({
    onSuccess: () => {
      utils.application.getAll.invalidate();
    },
  });

  if (apps.isLoading) return <p>Loading...</p>;
  if (apps.error) return <p>Error: {apps.error.message}</p>;

  return (
    <ul className="space-y-4">
      {apps.data?.map((app) => (
        <li
          key={app.id}
          className="border rounded p-2 flex justify-between items-start gap-4"
        >
          <div className="flex-1 space-y-1">
            <p className="text-lg font-semibold">
              {app.title} at {app.company?.name ?? "Unknown Company"}
            </p>
            <p className="text-sm text-muted-foreground">
              Status: {app.status} | Type: {app.type}
            </p>

            {app.location && (
              <p className="text-sm text-muted-foreground">
                Location: {app.location}
              </p>
            )}

            {app.deadline && (
              <p className="text-sm text-muted-foreground">
                Deadline: {new Date(app.deadline).toLocaleDateString()}
              </p>
            )}

            {app.contact && (
              <div className="mt-2 text-sm text-muted-foreground space-y-1">
                <p>Recruiter: {app.contact.name}</p>
                {app.contact.email && <p>Email: {app.contact.email}</p>}
                {app.contact.phone && <p>Phone: {app.contact.phone}</p>}
                {app.contact.linkedIn && (
                  <p className="flex items-center gap-1">
                    <ExternalLink size={14} />
                    <a
                      href={app.contact.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      LinkedIn
                    </a>
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col items-end gap-2">
            {/* Favorite toggle (optional) */}
            <button disabled>
              {app.favorite ? (
                <Heart className="text-pink-500 fill-pink-500" />
              ) : (
                <HeartOff className="text-muted-foreground" />
              )}
            </button>

            {/* Delete button */}
            <button
              onClick={() => deleteApp.mutate({ id: app.id })}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
