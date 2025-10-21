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
import { format } from 'date-fns';

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

import type { Quotation } from '@/lib/types';
import { QuotationWizard } from './quotation-wizard';
import { DeleteQuotationDialog } from './delete-quotation-dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

export const columns: ColumnDef<Quotation>[] = [
    {
        accessorKey: 'Id',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Quotation ID
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => <span className="font-mono pl-4">#{row.original.Id.substring(0, 8)}</span>,
      },
      {
        accessorKey: 'Site.Name',
        header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              >
                Site
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            );
          },
        cell: ({ row }) => <div className="pl-4">{row.original.Site?.Name}</div>,
      },
      {
        id: 'clientName',
        accessorFn: row => row.Site?.Client?.Name ?? '',
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
        cell: ({ row }) => <div className="pl-4">{row.getValue('clientName')}</div>,
      },
      {
        accessorKey: 'Description',
        header: 'Description',
        cell: ({ row }) => <p className="truncate max-w-xs">{row.original.Description}</p>
      },
      {
        accessorKey: 'Amount',
        header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              >
                Amount
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            );
          },
        cell: ({ row }) => <div className="pl-4">${row.original.Amount.toFixed(2)}</div>,
      },
      {
        accessorKey: 'CreatedOn',
        header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              >
                Created On
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            );
          },
        cell: ({ row }) => <div className="pl-4">{format(new Date(row.original.CreatedOn), 'dd/MM/yyyy')}</div>,
      },
  {
    id: 'actions',
    cell: ({ row }) => {
      const quotation = row.original;
      const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
      const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

      return (
        <div className="text-right">
            <QuotationWizard quotation={quotation} onOpenChange={setIsEditDialogOpen} open={isEditDialogOpen}>
                 <span/>
            </QuotationWizard>
            <DeleteQuotationDialog quotation={quotation} onOpenChange={setIsDeleteDialogOpen} open={isDeleteDialogOpen}>
                <span/>
            </DeleteQuotationDialog>

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

interface QuotationTableProps {
    quotations: Quotation[];
    total: number;
}

export function QuotationTable({ quotations, total }: QuotationTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  
  const table = useReactTable({
    data: quotations,
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

  const clients = React.useMemo(() => {
    const clientSet = new Set<string>();
    quotations.forEach(q => {
        if (q.Site?.Client?.Name) {
            clientSet.add(q.Site.Client.Name);
        }
    });
    return Array.from(clientSet);
  }, [quotations]);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between py-4">
          <Input
            placeholder="Filter by description..."
            value={(table.getColumn('Description')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('Description')?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <Select
            value={(table.getColumn('clientName')?.getFilterValue() as string) ?? 'all'}
            onValueChange={(value) => {
                table.getColumn('clientName')?.setFilterValue(value === 'all' ? '' : value);
            }}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by client" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Clients</SelectItem>
                    {clients.map(client => (
                        <SelectItem key={client} value={client}>{client}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
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
