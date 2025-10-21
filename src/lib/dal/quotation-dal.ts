
// DAL (Data Access Layer) for Quotations

import { prisma } from '@/lib/prisma';
import type { Quotation, QuotationFormData } from '@/lib/types';

// This is a placeholder for the company ID. In a real application, this
// would be retrieved from the user's session or authentication context.
const COMPANY_ID = '49397632-3864-4c53-A227-2342879B5841'; // Hardcoded company ID

// DAL function to get all quotations
export async function findManyQuotations(): Promise<Quotation[]> {
  const quotations = await prisma.quotation.findMany({
    include: {
      Client: true,
      Project: true,
      Status: true,
    },
  });

  return quotations as unknown as Quotation[];
}

// DAL function to get a single quotation by its ID
export async function findQuotationById(id: string): Promise<Quotation | undefined> {
    const quotation = await prisma.quotation.findUnique({
        where: { Id: id },
        include: {
            Client: true,
            Project: true,
            QuotationItems: true,
            Status: true,
        },
    });

    return quotation as unknown as Quotation || undefined;
}

// DAL function to create a new quotation
export async function createQuotation(quotationData: QuotationFormData): Promise<Quotation> {
  const quotation = await prisma.quotation.create({
    data: {
        ...quotationData,
        CompanyId: COMPANY_ID,
    },
  });
  return quotation as unknown as Quotation;
}

// DAL function to update an existing quotation
export async function updateQuotation(id: string, quotationData: Partial<QuotationFormData>): Promise<Quotation> {
  const quotation = await prisma.quotation.update({
    where: { Id: id },
    data: quotationData,
  });
  return quotation as unknown as Quotation;
}

// DAL function to delete a quotation
export async function deleteQuotation(id: string): Promise<void> {
  await prisma.quotation.delete({
    where: { Id: id },
  });
}
