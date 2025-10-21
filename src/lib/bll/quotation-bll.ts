
// BLL for Quotations

import * as dal from '@/lib/dal/quotation-dal';
import type { Quotation, QuotationFormData } from '@/lib/types';

// BLL function to get all quotations
export async function getQuotations(): Promise<Quotation[]> {
  const quotations = await dal.findManyQuotations();

  return quotations;
}

// BLL function to get a single quotation by its ID
export async function getQuotationById(id: string): Promise<Quotation | undefined> {
    return dal.findQuotationById(id);
}

// BLL function to create a new quotation
export async function createQuotation(quotationData: QuotationFormData): Promise<Quotation> {
    return dal.createQuotation(quotationData);
}

// BLL function to update an existing quotation
export async function updateQuotation(id: string, quotationData: Partial<QuotationFormData>): Promise<Quotation> {
    return dal.updateQuotation(id, quotationData);
}

// BLL function to delete a quotation
export async function deleteQuotation(id: string): Promise<void> {
  await dal.deleteQuotation(id);
}
