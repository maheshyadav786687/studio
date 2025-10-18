// Frontend API Service Layer for Clients
// This layer abstracts all API calls to the backend for the UIL.

import type { Client, ClientFormData } from '@/lib/types';

const BASE_URL = '/api/clients';

async function handleResponse(response: Response) {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'An unknown error occurred' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    // For 204 No Content, there's no body to parse
    if (response.status === 204) {
        return;
    }
    return response.json();
}

export async function getClients(): Promise<Client[]> {
    const response = await fetch(BASE_URL, { cache: 'no-store' });
    return handleResponse(response);
}

export async function createClient(data: ClientFormData): Promise<Client> {
    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return handleResponse(response);
}

export async function updateClient(id: string, data: Partial<ClientFormData>): Promise<Client> {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return handleResponse(response);
}

export async function deleteClient(id: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
    });
    return handleResponse(response);
}
