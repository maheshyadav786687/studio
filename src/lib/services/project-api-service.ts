// Frontend API Service Layer for Projects
// This layer abstracts all API calls to the backend for the UIL.

import type { Project } from '@/lib/types';

const BASE_URL = '/api/projects';

async function handleResponse(response: Response) {
    if (!response.ok) {
        if (response.status === 404) return null;
        const errorData = await response.json().catch(() => ({ error: 'An unknown error occurred' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    return response.json();
}

export async function getProjects(): Promise<Project[]> {
    const response = await fetch(BASE_URL, { cache: 'no-store' });
    return handleResponse(response);
}

export async function getProjectById(id: string): Promise<Project | null> {
    const response = await fetch(`${BASE_URL}/${id}`, { cache: 'no-store' });
    return handleResponse(response);
}
