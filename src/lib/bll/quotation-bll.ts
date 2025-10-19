
// BLL (Business Logic Layer) for Quotations
'use server';

import {
    findManyQuotations,
    createQuotation as createDbQuotation,
    updateQuotation as updateDbQuotation,
    deleteQuotation as deleteDbQuotation,
    findQuotationById,
} from '@/lib/dal/quotation-dal';
import {
    findSiteById,
    findManySitesGroupedByClient,
} from '@/lib/dal/site-dal';
import type { Quotation, QuotationFormData } from '@/lib/types';
import { QuotationFormSchema } from '@/lib/types';
import { z } from 'zod';


export type QuotationCreateDto = QuotationFormData;
export type QuotationUpdateDto = Partial<QuotationCreateDto>;

export async function getQuotations(): Promise<Quotation[]> {
  const quotations = await findManyQuotations();
  return quotations.map(q => ({ ...q, QuotationItems: (q.QuotationItems || []).map(item => ({...item, IsWithMaterial: Boolean(item.IsWithMaterial)})) }));
}

export async function getSitesGroupedByClient() {
    return await findManySitesGroupedByClient();
}

export async function getQuotationById(id: string): Promise<Quotation | undefined> {
    const quotation =  await findQuotationById(id);
    if (quotation) {
      return { ...quotation, QuotationItems: (quotation.QuotationItems || []).map(item => ({...item, IsWithMaterial: Boolean(item.IsWithMaterial)})) };
    }
    return undefined;
}

export async function createQuotation(quotationDto: QuotationCreateDto): Promise<Quotation> {
    const validatedData = QuotationFormSchema.parse(quotationDto);
    
    if (!validatedData.SiteId) {
        throw new Error('Site ID is required.');
    }

    const site = await findSiteById(validatedData.SiteId);
    if (!site) {
        throw new Error('Invalid site ID provided.');
    }
    
    const newQuotation = await createDbQuotation(validatedData, site.ClientId);
    return newQuotation;
}

export async function updateQuotation(id: string, quotationDto: QuotationUpdateDto): Promise<Quotation | undefined> {
    if (quotationDto.SiteId) {
        const site = await findSiteById(quotationDto.SiteId);
        if (!site) {
            throw new Error('Invalid site ID provided.');
        }
    }
    const updatedQuotation = await updateDbQuotation(id, quotationDto);
    return updatedQuotation;
}

export async function deleteQuotation(id: string): Promise<void> {
  await deleteDbQuotation(id);
}
