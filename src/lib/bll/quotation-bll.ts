
import * as quotationDAL from "@/lib/dal/quotation-dal";
import { QuotationFormData } from "@/lib/types";

export const getQuotations = async (page?: number, limit?: number, sortBy?: string, sortOrder?: string, search?: string) => {
  return await quotationDAL.getQuotations(page, limit, sortBy, sortOrder, search);
};

export const getQuotation = async (id: string) => {
  return await quotationDAL.getQuotation(id);
};

export const createQuotation = async (data: QuotationFormData) => {
  return await quotationDAL.createQuotation(data);
};

export const updateQuotation = async (id: string, data: QuotationFormData) => {
  return await quotationDAL.updateQuotation(id, data);
};

export const deleteQuotation = async (id: string) => {
  return await quotationDAL.deleteQuotation(id);
};
