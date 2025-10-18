
// Frontend API Service Layer for Sites

import type { Site, SiteFormData } from '@/lib/types';

const BASE_URL = '/api/sites';

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

export async function getSites(): Promise<Site[]> {
    const response = await fetch(BASE_URL, { cache: 'no-store' });
    return handleResponse(response);
}

export async function getSitesGroupedByClient() {
    const response = await fetch(`${BASE_URL}?grouped=true`, { cache: 'no-store' });
    return handleResponse(response);
}

export async function createSite(data: SiteFormData): Promise<Site> {
    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return handleResponse(response);
}

export async function updateSite(id: string, data: Partial<SiteFormData>): Promise<Site> {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return handleResponse(response);
}

export async function deleteSite(id: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
    });
    return handleResponse(response);
}
