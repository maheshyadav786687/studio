
export interface QuotationDto {
  id: string;
  projectId: string;
  items: QuotationItemDto[];
  total: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export interface QuotationItemDto {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}
