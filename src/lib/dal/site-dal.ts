
// DAL for Sites

import { prisma } from '@/lib/prisma';
import type { Site, SiteFormData } from '@/lib/types';

// This is a placeholder for the company ID. In a real application, this
// would be retrieved from the user's session or authentication context.
const COMPANY_ID = '49397632-3864-4c53-A227-2342879B5841'; // Hardcoded company ID

const includeRelations = {
  Client: true,
  _count: {
    select: { 
      Projects: true, 
      Quotations: true 
    },
  },
};

// Helper to transform site data
function transformSite(site: any): Site {
  return {
    ...site,
    ClientId: site.Client?.Id || null,
    clientName: site.Client?.Name || 'N/A',
    projectsCount: site._count?.Projects ?? 0,
    quotationsCount: site._count?.Quotations ?? 0,
  };
}

// DAL function to get all sites
export async function findManySites(options: { page?: number, limit?: number, sortBy?: string, sortOrder?: string, search?: string, all?: boolean } = {}): Promise<{ sites: Site[], total: number }> {
  const { page = 1, limit = 10, sortBy = 'Name', sortOrder = 'asc', search = '', all = false } = options;

  const where: any = {
    CompanyId: COMPANY_ID,
    ...(search && {
      OR: [
        { Name: { contains: search, mode: 'insensitive' } },
        { Location: { contains: search, mode: 'insensitive' } },
        { Client: { Name: { contains: search, mode: 'insensitive' } } },
      ],
    }),
  };

  const findOptions: any = {
    where,
    include: includeRelations,
    orderBy: { [sortBy]: sortOrder },
  };

  if (!all) {
    findOptions.skip = (page - 1) * limit;
    findOptions.take = limit;
  }

  const [sites, total] = await Promise.all([
    prisma.site.findMany(findOptions),
    prisma.site.count({ where }),
  ]);

  return { sites: sites.map(transformSite), total };
}

// DAL function to get a single site by its ID
export async function findSiteById(id: string): Promise<Site | null> {
  const site = await prisma.site.findUnique({
    where: { Id: id, CompanyId: COMPANY_ID },
    include: includeRelations,
  });

  return site ? transformSite(site) : null;
}

// DAL function to create a new site
export async function createSite(siteData: SiteFormData): Promise<Site> {
  const created = await prisma.site.create({
    data: {
      ...siteData,
      CompanyId: COMPANY_ID,
    },
  });
  const newSite = await findSiteById(created.Id);
  if (!newSite) {
    throw new Error('Failed to create or find site');
  }
  return newSite;
}

// DAL function to update an existing site
export async function updateSite(id: string, siteData: Partial<SiteFormData>): Promise<Site> {
  await prisma.site.update({
    where: { Id: id },
    data: siteData,
  });
  const updatedSite = await findSiteById(id);
  if (!updatedSite) {
    throw new Error('Failed to update or find site');
  }
  return updatedSite;
}

// DAL function to delete a site
export async function deleteSite(id: string): Promise<void> {
  await prisma.site.delete({
    where: { Id: id },
  });
}
