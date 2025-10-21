
// BLL (Business Logic Layer) for Quotations

'use server';

import {
    findManyQuotations,
    createQuotation as createDbQuotation,
    updateQuotation as updateDbQuotation,
    deleteQuotation as deleteDbQuotation,
    findQuotationById
} from '@/lib/dal/quotation-dal';
import type { Quotation, QuotationFormData } from '@/lib/types';

export type QuotationCreateDto = QuotationFormData;
export type QuotationUpdateDto = Partial<QuotationCreateDto>;

// BLL function to get all quotations
export async function getQuotations(): Promise<Quotation[]> {
  const quotations = await findManyQuotations();
  return quotations;
}

// BLL function to get a single quotation by its ID
export async function getQuotationById(id: string): Promise<Quotation | undefined> {
    return await findQuotationById(id);
}

// BLL function to create a new quotation
export async function createQuotation(quotationDto: QuotationCreateDto): Promise<Quotation> {
  const newQuotation = await createDbQuotation(quotationDto);
  return newQuotation;
}

// BLL function to update an existing quotation
export async function updateQuotation(id: string, quotationDto: QuotationUpdateDto): Promise<Quotation | undefined> {
  const updatedQuotation = await updateDbQuotation(id, quotationDto);
  return updatedQuotation;
}

// BLL function to delete a quotation
export async function deleteQuotation(id: string): Promise<void> {
  await deleteDbQuotation(id);
}
