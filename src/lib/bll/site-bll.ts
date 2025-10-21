
// BLL (Business Logic Layer) for Sites
'use server';

import {
    findManySites,
    createSite as createDbSite,
    updateSite as updateDbSite,
    deleteSite as deleteDbSite,
    findManySitesGroupedByClient as findManySitesGroupedByClientDb
} from '@/lib/dal/site-dal';
import { findClientById } from '@/lib/dal/client-dal';
import type { Site, SiteFormData } from '@/lib/types';

// DTO for creating a new site, based on the consolidated SiteFormData type.
export type SiteCreateDto = SiteFormData;

// DTO for updating an existing site, where all fields are optional.
export type SiteUpdateDto = Partial<SiteCreateDto>;

// BLL function to get all sites.
export async function getSites(options: { page?: number, limit?: number, sortBy?: string, sortOrder?: string, search?: string, all?: boolean } = {}) {
  return await findManySites(options);
}

// BLL function to get sites grouped by their respective clients.
export async function getSitesGroupedByClient() {
    // This function is useful for UI elements like dropdowns where sites are organized by client.
    return await findManySitesGroupedByClientDb();
}

// BLL function to create a new site.
export async function createSite(siteDto: SiteCreateDto): Promise<Site> {
  // Before creating a site, we validate that the provided client ID is valid.
  const client = await findClientById(siteDto.ClientId);
  if (!client) {
    throw new Error('Invalid client ID provided.');
  }
  
  // Calls the data access layer to create the site.
  const newSite = await createDbSite(siteDto);
  return newSite;
}

// BLL function to update an existing site.
export async function updateSite(id: string, siteDto: SiteUpdateDto): Promise<Site | undefined> {
  // If a new client ID is provided, we validate it before updating.
  if (siteDto.ClientId) {
      const client = await findClientById(siteDto.ClientId);
      if (!client) {
          throw new Error('Invalid client ID provided.');
      }
  }
  
  // Calls the data access layer to update the site.
  const updatedSite = await updateDbSite(id, siteDto);
  return updatedSite;
}

// BLL function to delete a site.
export async function deleteSite(id: string): Promise<void> {
  // Business logic can be added here, like checking for active projects on the site before deletion.
  
  // Calls the data access layer to delete the site.
  await deleteDbSite(id);
}
