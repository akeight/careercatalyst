"use client";

import { columns, Tracker } from "./columns";
import { DataTable } from "./data-table";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc/client";

export default function FavoritesList() {
  const { data: favorites = [], isLoading } =
    trpc.application.getFavorites.useQuery();

  if (isLoading) return <h3>Loading...</h3>;
  if (!favorites) return <h3>No favorite applications found.</h3>;

  const tableData: Tracker[] = favorites.map((app) => ({
    id: app.id,
    status: app.status as Tracker["status"],
    company: app.company?.name ?? "Unknown",
    date: app.createdAt, // or whatever formatting you want
  }));

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="w-full max-w-5xl mx-auto">
        <CardTitle className="text-center items-center">
          <span>Favorites List</span>
        </CardTitle>
        <CardContent className="overflow-x-auto">
          <DataTable columns={columns} data={tableData} />
        </CardContent>
      </Card>
    </div>
  );
}
