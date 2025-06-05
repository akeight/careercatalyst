"use client";

import { columns, Tracker } from "./columns";
import { DataTable } from "./data-table";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareHeart } from "@awesome.me/kit-3cb9aa7d8b/icons/duotone/solid";
import { trpc } from "@/lib/trpc/client";

export default function FavoritesList() {
  const { data: favorites = [], isLoading } =
    trpc.application.getFavorites.useQuery();

  if (isLoading) return <h3>Loading...</h3>;
  if (!favorites) return <h3>No favorite applications found.</h3>;

  const tableData: Tracker[] = favorites.map((app) => ({
    id: app.id,
    status: app.status.toLowerCase(),
    company: app.company?.name ?? "Unknown",
    date: app.createdAt, // or whatever formatting you want
  }));

  return (
    <Card className="w-full max-w-5xl mx-auto">
      <CardTitle className="text-center items-center">
        <FontAwesomeIcon icon={faSquareHeart} size="lg" />{" "}
        <span>Favorites List</span>
      </CardTitle>

      <CardContent className="overflow-x-auto">
        <DataTable columns={columns} data={tableData} />
      </CardContent>
    </Card>
  );
}
