
'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';

import { Quotation } from '@/lib/types';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { QuotationDialog } from './quotation-dialog';
import { deleteQuotation } from '@/lib/bll/quotation-bll';
import { useToast } from '@/hooks/use-toast';

interface QuotationTableProps {
  quotations: Quotation[];
  total: number;
}

export function QuotationTable({ quotations, total }: QuotationTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const columns: ColumnDef<Quotation>[] = [
    {
      accessorKey: 'Id',
      header: 'Quotation ID',
      cell: ({ row }) => <span className="font-mono">#{row.original.Id.substring(0, 8)}</span>,
    },
    {
      accessorKey: 'Site.Name',
      header: 'Site',
    },
    {
        accessorKey: 'Site.Client.Name',
        header: 'Client',
    },
    {
      accessorKey: 'Description',
      header: 'Description',
      cell: ({ row }) => <p className="truncate max-w-xs">{row.original.Description}</p>
    },
    {
      accessorKey: 'Amount',
      header: 'Amount',
      cell: ({ row }) => `$${row.original.Amount.toFixed(2)}`,
    },
    {
      accessorKey: 'CreatedOn',
      header: 'Created On',
      cell: ({ row }) => new Date(row.original.CreatedOn).toLocaleDateString(),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const quotation = row.original;

        const handleDelete = async () => {
            if (confirm('Are you sure you want to delete this quotation?')) {
                try {
                    await deleteQuotation(quotation.Id);
                    toast({ title: 'Success', description: 'Quotation deleted successfully.' });
                    router.refresh();
                } catch (error: any) {
                    toast({ title: 'Error', description: error.message, variant: 'destructive' });
                }
            }
        };

        return (
          <div className="flex gap-2">
            <QuotationDialog quotation={quotation}>
              <Button variant="outline" size="sm">Edit</Button>
            </QuotationDialog>
            <Button variant="destructive" size="sm" onClick={handleDelete}>Delete</Button>
          </div>
        );
      },
    },
  ];

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleSortChange = (column: string, direction: 'asc' | 'desc') => {
    const params = new URLSearchParams(searchParams);
    params.set('sortBy', column);
    params.set('sortOrder', direction);
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <DataTable
      columns={columns}
      data={quotations}
      total={total}
      onPageChange={handlePageChange}
      onSortChange={handleSortChange}
    />
  );
}
