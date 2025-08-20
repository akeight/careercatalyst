import FavoritesList from "@/components/dashboard/FavoritesChart/FavoritesList";
import React from "react";

export default async function FavoritesPage() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <div className="min-h-screen max-w-full">
        <div className="min-h-screen max-w-full">
          <div className="flex">
            <div className="size-svw mx-auto pt-10">
              <FavoritesList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
