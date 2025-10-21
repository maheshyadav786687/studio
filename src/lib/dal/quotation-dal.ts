
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
      Site: {
        include: {
            Client: true,
        },
      },
      Project: true,
      _count: {
        select: { QuotationItems: true },
      },
    },
  });

  return quotations.map(quotation => ({
    ...quotation,
    itemsCount: quotation._count.QuotationItems,
  }));
}

// DAL function to get a single quotation by its ID
export async function findQuotationById(id: string): Promise<Quotation | undefined> {
    const quotation = await prisma.quotation.findUnique({
        where: { Id: id },
        include: {
            Site: {
                include: {
                    Client: true,
                },
            },
            Project: true,
            QuotationItems: {
                include: {
                    Unit: true,
                },
            },
        },
    });

    if (quotation) {
        return {
            ...quotation,
            items: quotation.QuotationItems,
        };
    }
}

// DAL function to create a new quotation
export async function createQuotation(quotationData: QuotationFormData): Promise<Quotation> {
    const { items, ...quotation } = quotationData;

    const createdQuotation = await prisma.$transaction(async (prisma) => {
        const newQuotation = await prisma.quotation.create({
            data: {
                ...quotation,
                CompanyId: COMPANY_ID,
            },
        });

        if (items && items.length > 0) {
            await prisma.quotationItem.createMany({
                data: items.map(({ Amount, ...item }) => ({
                    ...item,
                    CompanyId: COMPANY_ID,
                    QuotationId: newQuotation.Id,
                })),
            });
        }

        return newQuotation;
    });

    return findQuotationById(createdQuotation.Id);
}

// DAL function to update an existing quotation
export async function updateQuotation(id: string, quotationData: Partial<QuotationFormData>): Promise<Quotation> {
    const { items, ...quotation } = quotationData;

    await prisma.$transaction(async (prisma) => {
        await prisma.quotation.update({
            where: { Id: id },
            data: quotation,
        });

        if (items) {
            await prisma.quotationItem.deleteMany({
                where: { QuotationId: id },
            });

            await prisma.quotationItem.createMany({
                data: items.map(({ Amount, ...item }) => ({
                    ...item,
                    CompanyId: COMPANY_ID,
                    QuotationId: id,
                })),
            });
        }
    });

    return findQuotationById(id);
}

// DAL function to delete a quotation
export async function deleteQuotation(id: string): Promise<void> {
  await prisma.quotation.delete({
    where: { Id: id },
  });
}
