
// BLL (Business Logic Layer) for Quotations
'use server';

import {
    findManyQuotations,
    findQuotationById,
    createQuotation as createDbQuotation,
    updateQuotation as updateDbQuotation,
    deleteQuotation as deleteDbQuotation
} from '@/lib/dal/quotation-dal';
import type { Quotation, QuotationFormData } from '@/lib/types';

// DTO for creating a new quotation, based on the consolidated QuotationFormData type.
export type QuotationCreateDto = QuotationFormData;

// DTO for updating an existing quotation, where all fields are optional.
export type QuotationUpdateDto = Partial<QuotationCreateDto>;

// BLL function to get all quotations.
export async function getQuotations(options: { page?: number, limit?: number, sortBy?: string, sortOrder?: string, search?: string, all?: boolean } = {}) {
  return await findManyQuotations(options);
}

// BLL function to get a single quotation by ID.
export async function getQuotationById(id: string): Promise<Quotation | null> {
    return await findQuotationById(id);
}

// BLL function to create a new quotation.
export async function createQuotation(quotationDto: QuotationCreateDto): Promise<Quotation> {
  // Calls the data access layer to create the quotation.
  const newQuotation = await createDbQuotation(quotationDto);
  return newQuotation;
}

// BLL function to update an existing quotation.
export async function updateQuotation(id: string, quotationDto: QuotationUpdateDto): Promise<Quotation | undefined> {
  // Calls the data access layer to update the quotation.
  const updatedQuotation = await updateDbQuotation(id, quotationDto);
  return updatedQuotation;
}

// BLL function to delete a quotation.
export async function deleteQuotation(id: string): Promise<void> {
  // Business logic can be added here, like checking for active projects on the quotation before deletion.
  
  // Calls the data access layer to delete the quotation.
  await deleteDbQuotation(id);
}
