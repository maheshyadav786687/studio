
// DAL (Data Access Layer) for Quotations

import { prisma } from '@/lib/prisma';
import type { Quotation, QuotationFormData } from '@/lib/types';

// This is a placeholder for the company ID. In a real application, this
// would be retrieved from the user's session or authentication context.
const COMPANY_ID = '49397632-3864-4c53-A227-2342879B5841'; // Hardcoded company ID

const includeRelations = {
  Project: true,
  Site: { include: { Client: true } },
  Status: true,
  QuotationItems: true,
};

// Helper to transform quotation data
function transformQuotation(quotation: any): Quotation {
  return {
    ...quotation,
    QuotationDate: new Date(quotation.QuotationDate),
    projectName: quotation.Project?.Name || 'N/A',
    siteName: quotation.Site?.Name || 'N/A',
    statusName: quotation.Status?.Name || 'N/A',
    statusColor: quotation.Status?.Color || 'gray',
  };
}


// DAL function to get all quotations
export async function findManyQuotations(options: { page?: number, limit?: number, sortBy?: string, sortOrder?: string, search?: string, all?: boolean } = {}) {
  const { page = 1, limit = 10, sortBy = 'Title', sortOrder = 'asc', search = '', all = false } = options;

  const where: any = {
    CompanyId: COMPANY_ID,
    ...(search && {
      OR: [
        { Title: { contains: search, mode: 'insensitive' } },
        { Description: { contains: search, mode: 'insensitive' } },
        { Project: { Name: { contains: search, mode: 'insensitive' } } },
        { Site: { Name: { contains: search, mode: 'insensitive' } } },
        { Site: { Client: { Name: { contains: search, mode: 'insensitive' } } } },
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

  const [quotations, total] = await Promise.all([
    prisma.quotation.findMany(findOptions),
    prisma.quotation.count({ where }),
  ]);

  return { quotations: quotations.map(transformQuotation), total };
}

// DAL function to get a single quotation by its ID
export async function findQuotationById(id: string): Promise<Quotation | null> {
    const quotation = await prisma.quotation.findUnique({
        where: { Id: id, CompanyId: COMPANY_ID },
        include: includeRelations,
    });

    if (quotation) {
        return transformQuotation(quotation);
    }
    return null;
}

// DAL function to create a new quotation
export async function createQuotation(quotationData: QuotationFormData): Promise<Quotation> {
  const { quotationItems, ...restOfQuotationData } = quotationData;
  const created = await prisma.quotation.create({
    data: {
      ...restOfQuotationData,
      CompanyId: COMPANY_ID,
      ...(quotationItems && {
        QuotationItems: {
          create: quotationItems.map(item => ({
            ...item,
            CompanyId: COMPANY_ID,
          })),
        },
      }),
    },
  });
  
  // Re-fetch the quotation to include all relations
  const newQuotation = await findQuotationById(created.Id);
  if (!newQuotation) {
    throw new Error('Failed to create or find quotation');
  }
  return newQuotation;
}

// DAL function to update an existing quotation
export async function updateQuotation(id: string, quotationData: Partial<QuotationFormData>): Promise<Quotation> {
  const { quotationItems, ...restOfQuotationData } = quotationData;
  await prisma.quotation.update({
    where: { Id: id },
    data: {
      ...restOfQuotationData,
      ...(quotationItems && {
        QuotationItems: {
          deleteMany: {},
          create: quotationItems.map(item => ({
            ...item,
            CompanyId: COMPANY_ID,
          })),
        },
      }),
    },
  });
  
  // Re-fetch the quotation to include all relations
  const updatedQuotation = await findQuotationById(id);
  if (!updatedQuotation) {
    throw new Error('Failed to update or find quotation');
  }
  return updatedQuotation;
}

// DAL function to delete a quotation
export async function deleteQuotation(id: string): Promise<void> {
  // Use a transaction to ensure both operations (deleting items and the quotation) succeed
  await prisma.$transaction([
    // Delete all quotation items associated with the quotation
    prisma.quotationItem.deleteMany({
      where: { QuotationId: id },
    }),
    // Delete the quotation itself
    prisma.quotation.delete({
      where: { Id: id },
    }),
  ]);
}
