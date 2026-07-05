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
import { ContactType } from "@prisma/client";
import { Search, Users } from "lucide-react";

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
import AddContactModal from "./AddContactModal";
import { contactColumns, contactTypeLabels, type ContactRow } from "./columns";

const globalFilterFn = (
  row: { original: ContactRow },
  _columnId: string,
  filterValue: string,
) => {
  const search = filterValue.trim().toLowerCase();
  if (!search) return true;
  const { name, companyName, title, email } = row.original;
  return [name, companyName, title, email]
    .filter(Boolean)
    .some((value) => String(value).toLowerCase().includes(search));
};

export default function ContactsTable() {
  const { data, isLoading } = trpc.contact.getAll.useQuery();

  const [globalFilter, setGlobalFilter] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );

  const rows: ContactRow[] = React.useMemo(
    () =>
      (data ?? []).map((contact) => ({
        id: contact.id,
        name: contact.name,
        type: contact.type,
        title: contact.title,
        companyId: contact.companyId,
        companyName: contact.company?.name ?? null,
        email: contact.email,
        phone: contact.phone,
        linkedIn: contact.linkedIn,
        notes: contact.notes,
      })),
    [data],
  );

  const table = useReactTable({
    data: rows,
    columns: contactColumns,
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
            <Users className="size-5 text-primary" />
            Contacts
          </CardTitle>
          <CardDescription>
            Your key network — recruiters, referrals, and connections. Not your
            full LinkedIn list, just the people that matter.
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
              placeholder="Search by name, company, or email..."
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
              {Object.values(ContactType).map((type) => (
                <SelectItem key={type} value={type}>
                  {contactTypeLabels[type]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-3 sm:ml-auto">
            <span className="text-sm text-muted-foreground">
              {table.getFilteredRowModel().rows.length} result
              {table.getFilteredRowModel().rows.length === 1 ? "" : "s"}
            </span>
            <AddContactModal />
          </div>
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
                    {contactColumns.map((_col, j) => (
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
                    colSpan={contactColumns.length}
                    className="h-32 text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <Users className="size-6" />
                      <p className="text-sm">
                        {globalFilter || typeFilter !== "ALL"
                          ? "No contacts match your search."
                          : "No contacts yet. Add recruiters, referrals, or connections to build your network."}
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
