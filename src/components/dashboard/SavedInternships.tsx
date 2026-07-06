"use client";

import Link from "next/link";
import { ArrowRight, Bookmark } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ApplicationDetailsDrawer,
  type ApplicationDetails,
} from "@/components/applications/ApplicationDetailsDrawer";
import { trpc } from "@/lib/trpc/client";

export default function SavedInternships() {
  const { data, isLoading } = trpc.application.getAll.useQuery();

  const saved = (data ?? []).filter((app) => app.status === "SAVED");
  const preview = saved.slice(0, 5);

  return (
    <Card className="w-full h-full">
      <CardHeader className="flex-row items-start justify-between space-y-0">
        <div className="grid gap-1">
          <CardTitle className="font-serif text-2xl">
            Saved Applications
          </CardTitle>
          <CardDescription>
            Pick up where you left off and continue your applications.
          </CardDescription>
        </div>
        {saved.length > 0 && (
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary tabular-nums">
            {saved.length}
          </span>
        )}
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-3">
        {isLoading && (
          <p className="text-sm text-muted-foreground">Loading...</p>
        )}

        {!isLoading && saved.length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 py-6 text-center">
            <Bookmark className="size-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Nothing saved yet. Save an internship to start an application.
            </p>
          </div>
        )}

        {preview.map((app) => (
          <ApplicationDetailsDrawer
            key={app.id}
            application={{
              id: app.id,
              type: app.type,
              title: app.title,
              companyId: app.companyId,
              companyName: app.company?.name ?? "Unknown company",
              location: app.location,
              status: app.status as ApplicationDetails["status"],
              source: app.source,
              appliedAt: app.appliedAt,
              deadline: app.deadline,
              favorite: app.favorite,
              createdAt: app.createdAt,
              updatedAt: app.updatedAt,
              contact: app.contact
                ? {
                    id: app.contact.id,
                    name: app.contact.name,
                    email: app.contact.email,
                    phone: app.contact.phone,
                    linkedIn: app.contact.linkedIn,
                    role: app.contact.role,
                    companyName: app.contact.company?.name,
                  }
                : null,
            }}
            trigger={
              <button className="group flex w-full items-center justify-between gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-accent/50">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium leading-none">
                    {app.title}
                  </p>
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {app.company?.name ?? "Unknown company"}
                    {app.location ? ` \u00b7 ${app.location}` : ""}
                  </p>
                </div>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </button>
            }
          />
        ))}

        {saved.length > 0 && (
          <Button asChild variant="outline" className="mt-auto w-full">
            <Link href="/tracker">
              Continue applications
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
