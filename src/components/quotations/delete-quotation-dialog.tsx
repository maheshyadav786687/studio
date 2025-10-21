
'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface DeleteQuotationDialogProps {
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteQuotationDialog({ onClose, onConfirm }: DeleteQuotationDialogProps) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Quotation</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete this quotation?</p>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirm}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
