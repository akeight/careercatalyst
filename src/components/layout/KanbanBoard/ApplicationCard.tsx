import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge, badgeVariants } from "@/components/ui/badge";
import React from "react";
import type { Application } from "@/store/useTrackerStore";
import { VariantProps } from "class-variance-authority";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@awesome.me/kit-3cb9aa7d8b/icons/chisel/regular";
import { trpc } from "@/lib/trpc/client";
//import {Tracker} from "@/components/dashboard/FavoritesChart/columns";

type ApplicationCardProps = {
  app: Application;
};

type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];

export default function ApplicationCard({ app }: ApplicationCardProps) {
  // 1) Map each exact Status value to one of the Badge’s variants:
  const statusVariantMap: Record<Application["status"], BadgeVariant> = {
    SAVED: "secondary",
    APPLIED: "default",
    INTERVIEW: "outline",
    PENDING: "secondary",
    OFFER: "destructive",
    REJECTED: "default",
  };

  // 2) Pick the variant that corresponds to this app’s status
  const variant = statusVariantMap[app.status];

  const utils = trpc.useUtils();

  const deleteMutation = trpc.application.delete.useMutation({
    onSuccess: () => {
      utils.application.getAll.invalidate();
    },
  });

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    deleteMutation.mutate({ id: app.id });
  };

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card  *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="w-49 h-35 mb-0.5 my-1.5 shadow-2xs">
        <CardHeader>
          <CardTitle className="font-smaller">{app.title}</CardTitle>
          <Badge variant={variant} className="text-[11px] px-1.75 py-0.75">
            {app.status}
          </Badge>
        </CardHeader>
        <CardContent className="text-[12px] flex justify-between font-sans">
          {app.company?.name && (
            <p>
              <strong>{app.company.name}</strong>
            </p>
          )}

          <button
            onClick={handleDelete}
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
          >
            <FontAwesomeIcon icon={faTrash} size="lg" />
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
