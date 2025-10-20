
import { prisma } from "@/lib/prisma";
import { QuotationFormData } from "@/lib/types";

const calculateAmounts = (items: any[]) => {
    let totalAmount = 0;
    const processedItems = items.map(item => {
        const amount = item.Quantity * item.Rate;
        totalAmount += amount;
        return { ...item, Amount: amount }; 
    });
    return { processedItems, totalAmount };
}

export const getQuotations = async (page = 1, limit = 10, sortBy = 'CreatedOn', sortOrder = 'desc', search = '') => {
    const where: any = search ? {
        OR: [
            { Description: { contains: search, mode: 'insensitive' } },
            { Site: { Name: { contains: search, mode: 'insensitive' } } },
            { Site: { Client: { Name: { contains: search, mode: 'insensitive' } } } },
        ],
    } : {};

    const [quotations, total] = await Promise.all([
        prisma.quotation.findMany({
            where,
            include: {
                Site: { include: { Client: true } }, // Include Client for searching
            },
            orderBy: { [sortBy]: sortOrder },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.quotation.count({ where }),
    ]);

    return { quotations, total };
};

export const getQuotation = async (id: string) => {
  return await prisma.quotation.findUnique({
    where: { Id: id },
    include: {
      QuotationItems: true,
      Site: true,
    },
  });
};

export const createQuotation = async (data: QuotationFormData) => {
  const { items, ...quotationData } = data;
  const { processedItems, totalAmount } = calculateAmounts(items || []);

  return await prisma.quotation.create({
    data: {
      ...quotationData,
      Amount: totalAmount,
      QuotationItems: {
        create: processedItems.map(item => ({
          Description: item.Description,
          Quantity: item.Quantity,
          Rate: item.Rate,
          UnitId: item.UnitId,
          Area: item.Area,
          IsWithMaterial: item.IsWithMaterial,
          Amount: item.Amount
        })),
      },
    },
  });
};

export const updateQuotation = async (id: string, data: QuotationFormData) => {
  const { items, ...quotationData } = data;
  const { processedItems, totalAmount } = calculateAmounts(items || []);


  // Run in transaction to ensure data integrity
  return await prisma.$transaction(async (tx) => {
    await tx.quotationItem.deleteMany({
        where: { QuotationId: id },
    });

    const updatedQuotation = await tx.quotation.update({
        where: { Id: id },
        data: {
          ...quotationData,
          Amount: totalAmount,
          QuotationItems: {
            create: processedItems.map(item => ({
              Description: item.Description,
              Quantity: item.Quantity,
              Rate: item.Rate,
              UnitId: item.UnitId,
              Area: item.Area,
              IsWithMaterial: item.IsWithMaterial,
              Amount: item.Amount
            })),
          },
        },
      });

      return updatedQuotation;
  });
};

export const deleteQuotation = async (id: string) => {
  return await prisma.quotation.delete({
    where: { Id: id },
  });
};
