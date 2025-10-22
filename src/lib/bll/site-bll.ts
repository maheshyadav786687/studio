
// BLL for Sites

import { findManySites, findSiteById, createSite as createSiteDal, updateSite as updateSiteDal, deleteSite as deleteSiteDal } from '@/lib/dal/site-dal';
import type { Site, SiteFormData } from '@/lib/types';

export async function getSites(options: { page?: number, limit?: number, sortBy?: string, sortOrder?: string, search?: string, all?: boolean } = {}): Promise<{ sites: Site[], total: number }> {
  const result = await findManySites(options);
  // Ensure that 'sites' is always an array, even if result is not as expected.
  return result || { sites: [], total: 0 };
}

export function getSiteById(id: string): Promise<Site | null> {
  return findSiteById(id);
}

export function createSite(siteData: SiteFormData): Promise<Site> {
  return createSiteDal(siteData);
}

export function updateSite(id: string, siteData: SiteFormData): Promise<Site> {
  return updateSiteDal(id, siteData);
}

export function deleteSite(id: string): Promise<void> {
  return deleteSiteDal(id);
}
