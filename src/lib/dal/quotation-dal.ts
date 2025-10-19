
// DAL (Data Access Layer) for Quotations

import { prisma } from '@/lib/prisma';
import type { Quotation, QuotationFormData } from '@/lib/types';

const COMPANY_ID = '49397632-3864-4c53-A227-2342879B5841'; // Hardcoded company ID
const UNIT_ID = 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1'; // Hardcoded unit ID

// DAL function to get all quotations
export async function findManyQuotations(): Promise<Quotation[]> {
  return await prisma.quotation.findMany({
    include: {
      Client: true,
      Site: true,
      QuotationItems: {
        include: {
          Unit: true,
        },
      },
    },
  }) as any;
}

// DAL function to get a single quotation by its ID
export async function findQuotationById(id: string): Promise<Quotation | undefined> {
    const quotation = await prisma.quotation.findUnique({
        where: { Id: id },
        include: {
            Client: true,
            Site: true,
            QuotationItems: {
              include: {
                Unit: true,
              },
            },
        },
    });
    return quotation as any;
}

// DAL function to create a new quotation
export async function createQuotation(quotationData: QuotationFormData, clientId: string): Promise<Quotation> {
  const { items, ...quotationDetails } = quotationData;

  const totalAmount = items ? items.reduce((acc, item) => {
    const quantity = item.Quantity || 0;
    const rate = item.Rate || 0;
    const area = item.Area || 0;
    const itemAmount = area > 0 ? quantity * rate * area : quantity * rate;
    return acc + itemAmount;
  }, 0) : 0;

  const quotation = await prisma.quotation.create({
    data: {
        ...quotationDetails,
        ClientId: clientId,
        CompanyId: COMPANY_ID,
        Amount: totalAmount,
        QuotationItems: {
            create: items?.map(item => ({...item, CompanyId: COMPANY_ID, IsWithMaterial: item.IsWithMaterial || false, UnitId: item.UnitId || UNIT_ID}))
        }
    },
    include: {
        QuotationItems: true
    }
  });
  return quotation as any;
}

// DAL function to update an existing quotation
export async function updateQuotation(id: string, quotationData: Partial<QuotationFormData>): Promise<Quotation> {
  const { items, ...quotationDetails } = quotationData;

  const totalAmount = items ? items.reduce((acc, item) => {
    const quantity = item.Quantity || 0;
    const rate = item.Rate || 0;
    const area = item.Area || 0;
    const itemAmount = area > 0 ? quantity * rate * area : quantity * rate;
    return acc + itemAmount;
  }, 0) : undefined;

  const dataToUpdate: any = { ...quotationDetails };
  if (totalAmount !== undefined) {
      dataToUpdate.Amount = totalAmount;
  }
  if (items) {
      dataToUpdate.QuotationItems = {
          deleteMany: {},
          create: items?.map(item => ({...item, CompanyId: COMPANY_ID, IsWithMaterial: item.IsWithMaterial || false, UnitId: item.UnitId || UNIT_ID}))
      }
  }

  const quotation = await prisma.quotation.update({
    where: { Id: id },
    data: {
        ...dataToUpdate,
        CompanyId: COMPANY_ID,
    },
    include: {
        QuotationItems: true
    }
  });
  return quotation as any;
}

// DAL function to delete a quotation
export async function deleteQuotation(id: string): Promise<void> {
  await prisma.quotation.delete({
    where: { Id: id },
  });
}
