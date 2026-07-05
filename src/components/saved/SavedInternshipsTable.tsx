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
import { Bookmark, Search } from "lucide-react";

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
import { savedColumns, type SavedRow } from "./columns";

const globalFilterFn = (
  row: { original: SavedRow },
  _columnId: string,
  filterValue: string,
) => {
  const search = filterValue.trim().toLowerCase();
  if (!search) return true;
  const { title, companyName, location, source } = row.original;
  return [title, companyName, location, source]
    .filter(Boolean)
    .some((value) => String(value).toLowerCase().includes(search));
};

export default function SavedInternshipsTable() {
  const { data, isLoading } = trpc.application.getSaved.useQuery();

  const [globalFilter, setGlobalFilter] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );

  const rows: SavedRow[] = React.useMemo(
    () =>
      (data ?? []).map((app) => ({
        id: app.id,
        type: app.type,
        title: app.title,
        companyId: app.companyId,
        companyName: app.company?.name ?? "Unknown company",
        location: app.location,
        source: app.source,
        jobUrl: app.jobUrl,
        deadline: app.deadline,
        status: app.status,
        favorite: app.favorite,
        contact: app.contact
          ? {
              name: app.contact.name,
              email: app.contact.email,
              phone: app.contact.phone,
              linkedIn: app.contact.linkedIn,
              role: app.contact.role,
            }
          : null,
      })),
    [data],
  );

  const table = useReactTable({
    data: rows,
    columns: savedColumns,
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

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader className="flex-row items-start justify-between space-y-0">
        <div className="grid gap-1">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Bookmark className="size-5 text-primary" />
            Saved Internships
          </CardTitle>
          <CardDescription>
            Every internship you&apos;ve saved. Search, open the posting, or
            pick up where you left off.
          </CardDescription>
        </div>
        {rows.length > 0 && (
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary tabular-nums">
            {rows.length}
          </span>
        )}
      </CardHeader>

      <CardContent>
        {/* Toolbar */}
        <div className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by position or company..."
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
              <SelectItem value="INTERNSHIP">Internship</SelectItem>
              <SelectItem value="FELLOWSHIP">Fellowship</SelectItem>
              <SelectItem value="EARLY_CAREER">Early Career</SelectItem>
            </SelectContent>
          </Select>

          <span className="text-sm text-muted-foreground sm:ml-auto">
            {table.getFilteredRowModel().rows.length} result
            {table.getFilteredRowModel().rows.length === 1 ? "" : "s"}
          </span>
        </div>

        {/* Table */}
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
                    {savedColumns.map((_col, j) => (
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
                    colSpan={savedColumns.length}
                    className="h-32 text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <Bookmark className="size-6" />
                      <p className="text-sm">
                        {globalFilter || typeFilter !== "ALL"
                          ? "No saved internships match your search."
                          : "Nothing saved yet. Save an internship to see it here."}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
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
