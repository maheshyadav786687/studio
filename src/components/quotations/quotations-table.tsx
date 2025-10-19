'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { format, isValid, parseISO } from 'date-fns';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { MoreHorizontal, Pencil, Trash2, ArrowUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Quotation } from '@/lib/types';
import { useQuotationDialog, QuotationDialog } from './quotation-dialog';
import { DeleteQuotationDialogProvider, useDeleteQuotationDialog } from './delete-quotation-dialog';

function QuotationsTableComponent({ data }: { data: Quotation[] }) {
  const router = useRouter();
  const quotationDialog = useQuotationDialog();
  const deleteQuotationDialog = useDeleteQuotationDialog();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const columns: ColumnDef<Quotation>[] = [
    {
        accessorKey: 'Client.Name',
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                Client
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const clientName = row.original.Client?.Name ?? '';
            return (
                <div className="flex items-center gap-3 pl-4">
                    <Avatar>
                        <AvatarFallback>{clientName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="font-medium">{clientName}</div>
                </div>
            );
        },
    },
    {
        accessorKey: 'Site.Name',
        header: 'Site',
        cell: ({ row }) => <div className="capitalize">{row.original.Site?.Name}</div>,
    },
    {
        accessorKey: 'Amount',
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                Amount
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div className="capitalize">{row.getValue('Amount')}</div>,
    },
    {
        accessorKey: 'CreatedOn',
        header: 'Quotation Date',
        cell: ({ row }) => {
            const dateValue = row.getValue("CreatedOn");
            const date = typeof dateValue === 'string' ? parseISO(dateValue) : dateValue as Date;
            return <div>{isValid(date) ? format(date, 'dd MMM yyyy') : 'Invalid Date'}</div>
        }
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const quotation = row.original;
        return (
            <div className="text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => quotationDialog.show({ quotationId: quotation.Id })}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => deleteQuotationDialog.show({ quotationId: quotation.Id, onConfirm: () => router.refresh() })} className="text-destructive">
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

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex items-center justify-between p-6">
          <Input
            placeholder="Filter by client..."
            value={(table.getColumn('Client.Name')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('Client.Name')?.setFilterValue(event.target.value)
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
        <div className="flex items-center justify-between p-6">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredRowModel().rows.length} row(s) available.
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

export function QuotationsTable({ data }: { data: Quotation[] }) {
    return (
        <QuotationDialog>
            <DeleteQuotationDialogProvider>
                <QuotationsTableComponent data={data} />
            </DeleteQuotationDialogProvider>
        </QuotationDialog>
    )
}
