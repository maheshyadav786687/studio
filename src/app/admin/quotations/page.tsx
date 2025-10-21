'use client';

import { useState, useEffect } from 'react';
import { Quotation, QuotationFormData } from '@/lib/types';
import {
  getQuotations,
  createQuotation,
  updateQuotation,
  deleteQuotation,
} from '@/lib/bll/quotation-bll';
import QuotationsTable from '@/components/quotations/quotations-table';
import QuotationDialog from '../../../components/quotations/quotation-dialog';
import DeleteQuotationDialog from '@/components/quotations/delete-quotation-dialog';
import { Button } from '@/components/ui/button';

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | undefined>(
    undefined,
  );
  const [quotationToDelete, setQuotationToDelete] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    async function fetchQuotations() {
      const data = await getQuotations();
      setQuotations(data);
    }
    fetchQuotations();
  }, []);

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedQuotation(undefined);
  };

  const handleDeleteDialogClose = () => {
    setIsDeleteDialogOpen(false);
    setQuotationToDelete(undefined);
  };

  const handleSaveChanges = async (quotationData: QuotationFormData) => {
    if (selectedQuotation) {
      // Update existing quotation
      const updatedQuotation = await updateQuotation(selectedQuotation.Id, quotationData);
      if(updatedQuotation){
          setQuotations(prev =>
            prev.map(q => (q.Id === updatedQuotation.Id ? updatedQuotation : q)),
          );
      }
    } else {
      // Create new quotation
      const newQuotation = await createQuotation(quotationData);
      if (newQuotation) {
        setQuotations(prev => [...prev, newQuotation]);
      }
    }
    handleDialogClose();
  };

  const handleDeleteConfirm = async () => {
    if (quotationToDelete) {
      await deleteQuotation(quotationToDelete);
      setQuotations(prev => prev.filter(q => q.Id !== quotationToDelete));
      handleDeleteDialogClose();
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quotations</h1>
        <Button onClick={() => setIsDialogOpen(true)}>New Quotation</Button>
      </div>
      <QuotationsTable
        quotations={quotations}
        onEdit={quotation => {
          setSelectedQuotation(quotation);
          setIsDialogOpen(true);
        }}
        onDelete={id => {
          setQuotationToDelete(id);
          setIsDeleteDialogOpen(true);
        }}
      />
      {isDialogOpen && (
        <QuotationDialog
          quotation={selectedQuotation}
          onClose={handleDialogClose}
          onSaveChanges={handleSaveChanges}
        />
      )}
      {isDeleteDialogOpen && (
        <DeleteQuotationDialog
          onClose={handleDeleteDialogClose}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}
