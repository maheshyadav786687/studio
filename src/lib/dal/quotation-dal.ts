
// DAL (Data Access Layer) for Quotations

import { prisma } from '@/lib/prisma';
import type { Quotation, QuotationFormData } from '@/lib/types';

// This is a placeholder for the company ID. In a real application, this
// would be retrieved from the user's session or authentication context.
const COMPANY_ID = '49397632-3864-4c53-A227-2342879B5841'; // Hardcoded company ID

// DAL function to get all quotations
export async function findManyQuotations(options: { page?: number, limit?: number, sortBy?: string, sortOrder?: string, search?: string, all?: boolean } = {}) {
  const { page = 1, limit = 10, sortBy = 'Title', sortOrder = 'asc', search = '', all = false } = options;

  const where: any = search ? {
    OR: [
      { Title: { contains: search, mode: 'insensitive' } },
      { Description: { contains: search, mode: 'insensitive' } },
      { Project: { Name: { contains: search, mode: 'insensitive' } } },
    ],
  } : {};

  const findOptions: any = {
    where,
    include: {
      Project: true, // Include the related Project
    },
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

  const quotationsWithProjectData = quotations.map(quotation => ({
    ...quotation,
    projectName: quotation.Project?.Name || 'N/A',
  }));

  return { quotations: quotationsWithProjectData, total };
}

// DAL function to get a single quotation by its ID
export async function findQuotationById(id: string): Promise<Quotation | null> {
    const quotation = await prisma.quotation.findUnique({
        where: { Id: id },
        include: {
          Project: true, // Include the related Project
          Site: true, // Include the related Site
          QuotationItems: true, // Include the related QuotationItems
        },
    });

    if (quotation) {
        return {
            ...quotation,
            projectName: quotation.Project?.Name || 'N/A',
        };
    }
    return null;
}

// DAL function to create a new quotation
export async function createQuotation(quotationData: QuotationFormData): Promise<Quotation> {
  const { quotationItems, ...restOfQuotationData } = quotationData;
  const quotation = await prisma.quotation.create({
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
  return quotation;
}

// DAL function to update an existing quotation
export async function updateQuotation(id: string, quotationData: Partial<QuotationFormData>): Promise<Quotation> {
  const { quotationItems, ...restOfQuotationData } = quotationData;
  const quotation = await prisma.quotation.update({
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
  return quotation;
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
