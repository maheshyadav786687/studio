
// BLL (Business Logic Layer) for Quotations
'use server';

import {
    findManyQuotations,
    createQuotation as createDbQuotation,
    updateQuotation as updateDbQuotation,
    deleteQuotation as deleteDbQuotation,
    findQuotationById,
    findSiteById,
} from '@/lib/database';
import type { Quotation } from '@/lib/types';
import { QuotationFormSchema } from '@/lib/types';
import { z } from 'zod';


export type QuotationCreateDto = z.infer<typeof QuotationFormSchema>;
export type QuotationUpdateDto = Partial<QuotationCreateDto>;

export async function getQuotations(): Promise<Quotation[]> {
  const quotations = await findManyQuotations();
  return quotations;
}

export async function getQuotationById(id: string): Promise<Quotation | undefined> {
    return await findQuotationById(id);
}

export async function createQuotation(quotationDto: QuotationCreateDto): Promise<Quotation> {
    const validatedData = QuotationFormSchema.parse(quotationDto);
    
    const site = await findSiteById(validatedData.siteId);
    if (!site) {
        throw new Error('Invalid site ID provided.');
    }
    
    // For simplicity, we'll pass the whole DTO. In a real app, you might transform it.
    const newQuotation = await createDbQuotation(validatedData);
    return newQuotation;
}

export async function updateQuotation(id: string, quotationDto: QuotationUpdateDto): Promise<Quotation | undefined> {
    if (quotationDto.siteId) {
        const site = await findSiteById(quotationDto.siteId);
        if (!site) {
            throw new Error('Invalid site ID provided.');
        }
    }
    const updatedQuotation = await updateDbQuotation(id, quotationDto);
    return updatedQuotation;
}

export async function deleteQuotation(id: string): Promise<void> {
  // Business logic could go here, e.g., check if quotation is approved
  await deleteDbQuotation(id);
}
