import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import React from "react";

type ApplicationCardProps = {
  app: {
    id: string;
    title: string;
    location?: string | null;
    status: string;
    deadline?: string | Date | null;
    company?: { name: string } | null;
    contact?: {
      name: string;
      email?: string;
      phone?: string;
      linkedIn?: string;
    } | null;
  };
  onDelete?: () => void;
  footerSlot?: React.ReactNode;
};

export default function ApplicationCard({
  app,
  onDelete,
  footerSlot,
}: ApplicationCardProps) {
  return (
    <Card className="h-full">
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
                className="text-blue-400 underline"
              >
                LinkedIn
              </a>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter>
        {footerSlot ??
          (onDelete && (
            <button
              onClick={onDelete}
              className="text-red-400 hover:underline text-sm"
            >
              Delete
            </button>
          ))}
      </CardFooter>
    </Card>
  );
}
