
// BLL (Business Logic Layer) for Sites
'use server';

import {
    findManySites,
    createSite as createDbSite,
    updateSite as updateDbSite,
    deleteSite as deleteDbSite,
    findSiteById,
    findClientById,
    findManySitesGroupedByClient as findManySitesGroupedByClientDb
} from '@/lib/database';
import type { Site } from '@/lib/types';

export type SiteCreateDto = Omit<Site, 'id' | 'client' | 'projects' | 'quotations' | 'projectsCount' | 'quotationsCount'>;
export type SiteUpdateDto = Partial<SiteCreateDto>;

export async function getSites(): Promise<Site[]> {
  const sites = await findManySites();
  // Here you could add business logic, e.g., mapping additional data
  return sites;
}

export async function getSitesGroupedByClient() {
    return await findManySitesGroupedByClientDb();
}

export async function createSite(siteDto: SiteCreateDto): Promise<Site> {
  const client = await findClientById(siteDto.clientId);
  if (!client) {
    throw new Error('Invalid client ID provided.');
  }
  const newSite = await createDbSite(siteDto);
  return newSite;
}

export async function updateSite(id: string, siteDto: SiteUpdateDto): Promise<Site | undefined> {
  if (siteDto.clientId) {
      const client = await findClientById(siteDto.clientId);
      if (!client) {
          throw new Error('Invalid client ID provided.');
      }
  }
  const updatedSite = await updateDbSite(id, siteDto);
  return updatedSite;
}

export async function deleteSite(id: string): Promise<void> {
  // Business logic: check if site has active projects before deleting
  // For now, we'll just call the DAL
  await deleteDbSite(id);
}
