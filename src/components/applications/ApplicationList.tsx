// components/ApplicationList.tsx
"use client";

import { trpc } from "@/lib/trpc/client"; // adjust path
import { Trash2 } from "lucide-react";

export default function ApplicationList({ userId }: { userId: string }) {
  const utils = trpc.useUtils();
  const apps = trpc.application.getAll.useQuery({ userId });
  const deleteApp = trpc.application.delete.useMutation({
    onSuccess: () => utils.application.getAll.invalidate(),
  });

  if (apps.isLoading) return <p>Loading...</p>;
  if (apps.error) return <p>Error: {apps.error.message}</p>;

  return (
    <ul className="space-y-2 p-4">
      {apps.data?.map((app) => (
        <li
          key={app.id}
          className="border rounded p-2 flex justify-between items-center"
        >
          <div>
            <p>
              <strong>{app.position}</strong> at {app.company}
            </p>
            <p>Status: {app.status}</p>
            {app.deadline && (
              <p>Deadline: {new Date(app.deadline).toLocaleDateString()}</p>
            )}
          </div>
          <button
            onClick={() => deleteApp.mutate({ id: app.id })}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 size={16} />
          </button>
        </li>
      ))}
    </ul>
  );
}
