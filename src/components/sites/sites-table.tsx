
'use client';
import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { MoreHorizontal, Pencil, Trash2, ArrowUpDown } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

import type { Site } from '@/lib/types';
import { SiteDialog } from './site-dialog';
import { DeleteSiteDialog } from './delete-site-dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

export const columns: ColumnDef<Site>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Site Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="pl-4 font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: 'address',
    header: "Address",
  },
  {
    accessorKey: 'clientName',
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Client
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="pl-4">{row.original.client?.name || 'N/A'}</div>,
  },
  {
    id: 'counts',
    header: ({ column }) => {
        return (
            <div className="text-center">
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Counts
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            </div>
        );
    },
    cell: ({ row }) => {
        const site = row.original;
        return (
            <div className="text-center space-y-1">
                <div className="text-xs">
                    <span className="font-semibold">{site.projectsCount || 0}</span> Projects
                </div>
                <div className="text-xs text-muted-foreground">
                    <span className="font-semibold">{site.quotationsCount || 0}</span> Quotes
                </div>
            </div>
        );
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const site = row.original;
      const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
      const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

      return (
        <div className="text-right">
            <SiteDialog site={site} onOpenChange={setIsEditDialogOpen} open={isEditDialogOpen}>
                 <span/>
            </SiteDialog>
            <DeleteSiteDialog site={site} onOpenChange={setIsDeleteDialogOpen} open={isDeleteDialogOpen}>
                <span/>
            </DeleteSiteDialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

export function SitesTable({ sites }: { sites: Site[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  
  const table = useReactTable({
    data: sites,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      }
    }
  });

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between py-4">
          <Input
            placeholder="Filter sites by name..."
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('name')?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
           <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Rows per page</p>
              <Select
                  value={`${table.getState().pagination.pageSize}`}
                  onValueChange={(value) => {
                  table.setPageSize(Number(value))
                  }}
              >
                  <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={table.getState().pagination.pageSize} />
                  </SelectTrigger>
                  <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                      </SelectItem>
                  ))}
                  </SelectContent>
              </Select>
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between pt-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-sm">
                  <div>Page</div>
                  <strong>
                  {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                  </strong>
              </span>
              <div className="flex items-center gap-2">
                  <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => table.setPageIndex(0)}
                      disabled={!table.getCanPreviousPage()}
                      >
                      <span className="sr-only">Go to first page</span>
                      {'<<'}
                  </Button>
                  <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                      >
                      <span className="sr-only">Go to previous page</span>
                      {'<'}
                  </Button>
                  <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                      >
                      <span className="sr-only">Go to next page</span>
                      {'>'}
                  </Button>
                  <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                      disabled={!table.getCanNextPage()}
                      >
                      <span className="sr-only">Go to last page</span>
                      {'>>'}
                  </Button>
              </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
