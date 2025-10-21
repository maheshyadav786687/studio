
'use client';

import { useState } from 'react';
import { Quotation, QuotationItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface QuotationDialogProps {
  quotation?: Quotation;
  onClose: () => void;
  onSaveChanges: (quotation: Quotation) => void;
}

export default function QuotationDialog({ quotation, onClose, onSaveChanges }: QuotationDialogProps) {
  const [editedQuotation, setEditedQuotation] = useState(quotation || {} as Quotation);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedQuotation(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{quotation ? 'Edit Quotation' : 'New Quotation'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">Amount</Label>
            <Input id="amount" name="Amount" value={editedQuotation.Amount || ''} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <Input id="description" name="Description" value={editedQuotation.Description || ''} onChange={handleInputChange} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSaveChanges(editedQuotation)}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
