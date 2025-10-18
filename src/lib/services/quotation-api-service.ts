
// Frontend API Service Layer for Quotations
import type { Quotation, QuotationFormData } from '@/lib/types';

const BASE_URL = '/api/quotations';

async function handleResponse(response: Response) {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'An unknown error occurred' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    if (response.status === 204) {
        return;
    }
    return response.json();
}

export async function getQuotations(): Promise<Quotation[]> {
    const response = await fetch(BASE_URL, { cache: 'no-store' });
    return handleResponse(response);
}

export async function createQuotation(data: QuotationFormData): Promise<Quotation> {
    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return handleResponse(response);
}

export async function updateQuotation(id: string, data: Partial<QuotationFormData>): Promise<Quotation> {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return handleResponse(response);
}

export async function deleteQuotation(id: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
    });
    return handleResponse(response);
}
