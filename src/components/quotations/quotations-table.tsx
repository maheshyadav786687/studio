
'use client';

import { Quotation } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface QuotationsTableProps {
  quotations: Quotation[];
  onEdit: (quotation: Quotation) => void;
  onDelete: (id: string) => void;
}

export default function QuotationsTable({ quotations, onEdit, onDelete }: QuotationsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Project</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {quotations.map((quotation) => (
          <TableRow key={quotation.Id}>
            <TableCell>{quotation.Project?.Name || 'N/A'}</TableCell>
            <TableCell>{quotation.Client?.Name || 'N/A'}</TableCell>
            <TableCell>{quotation.Amount}</TableCell>
            <TableCell>{quotation.Status?.Name || 'N/A'}</TableCell>
            <TableCell>
              <Button variant="outline" size="sm" onClick={() => onEdit(quotation)}>Edit</Button>
              <Button variant="destructive" size="sm" className="ml-2" onClick={() => onDelete(quotation.Id)}>Delete</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
