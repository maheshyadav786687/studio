
import {
    findManyQuotations,
    findQuotationById,
    createQuotation as dalCreateQuotation,
    updateQuotation as dalUpdateQuotation,
    deleteQuotation as dalDeleteQuotation
} from '@/lib/dal/quotation-dal';
import type { Quotation, QuotationFormData } from '@/lib/types';

export async function getQuotations(): Promise<Quotation[]> {
    return await findManyQuotations();
}

export async function getQuotation(id: string): Promise<Quotation | undefined> {
    return await findQuotationById(id);
}

export async function createQuotation(quotationData: QuotationFormData): Promise<Quotation> {
    return await dalCreateQuotation(quotationData);
}

export async function updateQuotation(id: string, quotationData: Partial<QuotationFormData>): Promise<Quotation> {
    return await dalUpdateQuotation(id, quotationData);
}

export async function deleteQuotation(id: string): Promise<void> {
    return await dalDeleteQuotation(id);
}
