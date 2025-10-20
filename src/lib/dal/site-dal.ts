
// DAL (Data Access Layer) for Sites

import { prisma } from '@/lib/prisma';
import type { Site, SiteFormData } from '@/lib/types';

// This is a placeholder for the company ID. In a real application, this
// would be retrieved from the user's session or authentication context.
const COMPANY_ID = '49397632-3864-4c53-A227-2342879B5841'; // Hardcoded company ID

// DAL function to get all sites
export async function findManySites(options: { page?: number, limit?: number, sortBy?: string, sortOrder?: string, search?: string } = {}) {
  const { page = 1, limit = 10, sortBy = 'Name', sortOrder = 'asc', search = '' } = options;

  const where: any = search ? {
    OR: [
      { Name: { contains: search, mode: 'insensitive' } },
      { Location: { contains: search, mode: 'insensitive' } },
      { Client: { Name: { contains: search, mode: 'insensitive' } } },
    ],
  } : {};

  const [sites, total] = await Promise.all([
    prisma.site.findMany({
      where,
      include: {
        Client: true, // Include the related Client
        _count: { select: { projects: true, quotations: true } },
      },
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.site.count({ where }),
  ]);

  return { sites, total };
}

// DAL function to get a single site by its ID
export async function findSiteById(id: string): Promise<Site | null> {
    const site = await prisma.site.findUnique({
        where: { Id: id },
        include: {
          Client: true, // Include the related Client
        },
    });

    if (site) {
        return {
            ...site,
            clientName: site.Client?.Name || 'N/A',
            clientAddress: site.Client?.Address || '',
        };
    }
    return null;
}

// DAL function to get sites grouped by their respective clients
export async function findManySitesGroupedByClient() {
    const clients = await prisma.client.findMany({
        include: {
            Sites: true,
        },
    });
    return clients.map(client => ({
        clientName: client.Name,
        sites: client.Sites.map(site => ({ id: site.Id, name: site.Name }))
    }));
}

// DAL function to create a new site
export async function createSite(siteData: SiteFormData): Promise<Site> {
  const site = await prisma.site.create({
    data: {
        ...siteData,
        CompanyId: COMPANY_ID,
    },
  });
  return site;
}

// DAL function to update an existing site
export async function updateSite(id: string, siteData: Partial<SiteFormData>): Promise<Site> {
  const site = await prisma.site.update({
    where: { Id: id },
    data: siteData,
  });
  return site;
}

// DAL function to delete a site
export async function deleteSite(id: string): Promise<void> {
  await prisma.site.delete({
    where: { Id: id },
  });
}
