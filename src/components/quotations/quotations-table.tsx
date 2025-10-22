
'use client';

import * as React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
} from '@tanstack/react-table';
import { MoreHorizontal, Pencil, Trash2, ArrowUpDown } from 'lucide-react';
import { format } from 'date-fns';

import { Badge } from '@/components/ui/badge';
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
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import type { Quotation } from '@/lib/types';
import { QuotationDialog } from './quotation-dialog';
import { DeleteQuotationDialog } from './delete-quotation-dialog';

const columns: ColumnDef<Quotation>[] = [
  {
    accessorKey: 'Title',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Quotation Title
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="pl-4 font-medium">{row.getValue("Title")}</div>,
  },
  {
    accessorKey: 'QuotationDate',
    header: 'Quotation Date',
    cell: ({ row }) => format(new Date(row.getValue('QuotationDate')), 'PPP'),
  },
  {
    accessorKey: 'siteName',
    header: 'Site',
  },
  {
    accessorKey: 'projectName',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Project
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="pl-4">{row.getValue("projectName")}</div>,
  },
  {
    accessorKey: 'statusName',
    header: 'Status',
    cell: ({ row }) => {
      const statusName = row.getValue('statusName') as string;
      const statusColor = row.original.statusColor;
      return <Badge style={{ backgroundColor: statusColor || 'gray' }}>{statusName}</Badge>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const quotation = row.original;
      const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
      const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

      return (
        <div className="text-right">
          <QuotationDialog quotation={quotation} onOpenChange={setIsEditDialogOpen} open={isEditDialogOpen}>
            <span />
          </QuotationDialog>
          <DeleteQuotationDialog quotation={quotation} onOpenChange={setIsDeleteDialogOpen} open={isDeleteDialogOpen}>
            <span />
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

export function QuotationsTable({ quotations, pageCount }: { quotations: Quotation[], pageCount: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;
  const search = searchParams.get('search') || '';
  const sortBy = searchParams.get('sortBy') || 'Title';
  const sortOrder = searchParams.get('sortOrder') || 'asc';

  const [sorting, setSorting] = React.useState<SortingState>([{ id: sortBy, desc: sortOrder === 'desc' }]);

  const table = useReactTable({
    data: quotations,
    columns,
    pageCount,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    state: {
      sorting,
      pagination: {
        pageIndex: page - 1,
        pageSize: limit,
      },
    },
    onSortingChange: (updater) => {
      const newSorting = typeof updater === 'function' ? updater(sorting) : updater;
      setSorting(newSorting);
      if (newSorting.length > 0) {
        const sort = newSorting[0];
        createQueryString({ sortBy: sort.id, sortOrder: sort.desc ? 'desc' : 'asc' });
      } else {
        createQueryString({ sortBy: 'Title', sortOrder: 'asc' });
      }
    },
  });

  const createQueryString = (params: Record<string, string | number | null>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(params)) {
      if (value === null) {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, String(value));
      }
    }
    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <Input
            placeholder="Filter quotations..."
            value={search}
            onChange={(event) => createQueryString({ search: event.target.value, page: 1 })}
            className="max-w-sm"
          />
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${limit}`}
              onValueChange={(value) => createQueryString({ limit: Number(value), page: 1 })}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={limit} />
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
        <div className="rounded-md border mt-4">
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
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
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
        <div className="flex items-center justify-between mt-4">
            <div className="flex-1 text-sm text-muted-foreground">
                Showing page {page} of {pageCount}
            </div>
            <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-sm">
                    <div>Page</div>
                    <strong>
                        {page} of {pageCount}
                    </strong>
                </span>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => createQueryString({ page: 1 })}
                        disabled={page === 1}
                        >
                        <span className="sr-only">Go to first page</span>
                        {'<<'}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => createQueryString({ page: page - 1 })}
                        disabled={page === 1}
                        >
                        <span className="sr-only">Go to previous page</span>
                        {'<'}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => createQueryString({ page: page + 1 })}
                        disabled={page === pageCount}
                        >
                        <span className="sr-only">Go to next page</span>
                        {'>'}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => createQueryString({ page: pageCount })}
                        disabled={page === pageCount}
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
