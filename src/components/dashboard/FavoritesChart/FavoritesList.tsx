"use client";

import * as React from "react";
import {
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Heart, Search } from "lucide-react";
import { Status } from "@prisma/client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc/client";
import {
  mapApplicationContact,
  type ApplicationContactSummary,
} from "@/lib/mapApplicationContact";
import { columns, type FavoriteRow } from "./columns";

const typeLabels: Record<FavoriteRow["type"], string> = {
  INTERNSHIP: "Internship",
  FELLOWSHIP: "Fellowship",
  EARLY_CAREER: "Early Career",
};

const statusLabels: Record<Status, string> = {
  SAVED: "Saved",
  APPLIED: "Applied",
  INTERVIEW: "Interview",
  PENDING: "Pending",
  OFFER: "Offer",
  REJECTED: "Rejected",
};

const globalFilterFn = (
  row: { original: FavoriteRow },
  _columnId: string,
  filterValue: string,
) => {
  const search = filterValue.trim().toLowerCase();
  if (!search) return true;
  const { title, companyName, location, source, status } = row.original;
  return [title, companyName, location, source, status]
    .filter(Boolean)
    .some((value) => String(value).toLowerCase().includes(search));
};

export default function FavoritesList() {
  const { data: favorites = [], isLoading } =
    trpc.application.getFavorites.useQuery();

  const [globalFilter, setGlobalFilter] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );

  const rows: FavoriteRow[] = React.useMemo(
    () =>
      favorites.map((app) => {
        const appWithDetails = app as typeof app & {
          jobUrl: string | null;
          notes: string | null;
        };

        return {
          id: app.id,
          type: app.type,
          title: app.title,
          companyId: app.companyId,
          companyName: app.company?.name ?? "Unknown company",
          location: app.location,
          status: app.status,
          source: app.source,
          jobUrl: appWithDetails.jobUrl,
          notes: appWithDetails.notes,
          appliedAt: app.appliedAt,
          deadline: app.deadline,
          favorite: app.favorite,
          createdAt: app.createdAt,
          updatedAt: app.updatedAt,
          contact: mapApplicationContact(
            app.contact as ApplicationContactSummary | null,
          ),
        };
      }),
    [favorites],
  );

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting, columnFilters, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const typeFilter =
    (table.getColumn("type")?.getFilterValue() as string) ?? "ALL";
  const statusFilter =
    (table.getColumn("status")?.getFilterValue() as string) ?? "ALL";

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader className="flex-row items-start justify-between space-y-0">
        <div className="grid gap-1">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Heart className="size-5 text-primary" />
            Favorite Internships
          </CardTitle>
          <CardDescription>
            Your most important opportunities in one place. Search, filter, and
            jump back to the job posting.
          </CardDescription>
        </div>
        {rows.length > 0 && (
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary tabular-nums">
            {rows.length}
          </span>
        )}
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by position, company, or status..."
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="pl-8"
            />
          </div>

          <Select
            value={typeFilter}
            onValueChange={(value) =>
              table
                .getColumn("type")
                ?.setFilterValue(value === "ALL" ? undefined : value)
            }
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All types</SelectItem>
              {Object.entries(typeLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={statusFilter}
            onValueChange={(value) =>
              table
                .getColumn("status")
                ?.setFilterValue(value === "ALL" ? undefined : value)
            }
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All statuses</SelectItem>
              {Object.entries(statusLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span className="text-sm text-muted-foreground sm:ml-auto">
            {table.getFilteredRowModel().rows.length} result
            {table.getFilteredRowModel().rows.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={`skeleton-${i}`}>
                    {columns.map((_col, j) => (
                      <TableCell key={`skeleton-${i}-${j}`}>
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-32 text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <Heart className="size-6" />
                      <p className="text-sm">
                        {globalFilter ||
                        typeFilter !== "ALL" ||
                        statusFilter !== "ALL"
                          ? "No favorite internships match your search."
                          : "No favorites yet. Mark internships as favorites to see them here."}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {table.getPageCount() > 1 && (
          <div className="flex items-center justify-end gap-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
