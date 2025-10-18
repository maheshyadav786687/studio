
import { z } from 'zod';
import { format } from 'date-fns';

export const units = [
    'Square Feet',
    'Square Meters',
    'Running Feet',
    'Running Meters',
    'Cubic Feet',
    'Cubic Meters',
    'Lump Sum',
    'Numbers',
    'Kilogram',
    'Litre',
] as const;
const UnitEnum = z.enum(units);

export const QuotationItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, 'Description is required.'),
  quantity: z.number().min(0, 'Quantity must be positive.'),
  unit: UnitEnum,
  rate: z.number().min(0, 'Rate must be positive.'),
  amount: z.number(),
  area: z.number().min(0, 'Area must be positive.').optional(),
  material: z.boolean(),
});
export type QuotationItem = z.infer<typeof QuotationItemSchema>;

export const QuotationSchema = z.object({
  id: z.string(),
  quotationNumber: z.string(),
  quotationDate: z.string(),
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  status: z.enum(['Draft', 'Sent', 'Approved', 'Rejected']),
  siteId: z.string({ required_error: 'Site is required.' }),
  siteName: z.string().optional(), // Populated from DB join
  clientName: z.string().optional(), // Populated from DB join
  items: z.array(QuotationItemSchema),
});
export type Quotation = z.infer<typeof QuotationSchema>;

const FormQuotationItemSchema = QuotationItemSchema.omit({ amount: true, id: true });

export const QuotationFormSchema = QuotationSchema.omit({ 
    id: true, 
    siteName: true,
    clientName: true,
    quotationNumber: true,
}).extend({
    items: z.array(FormQuotationItemSchema).optional(),
    quotationDate: z.union([z.date(), z.string()]).transform(val => val instanceof Date ? format(val, 'yyyy-MM-dd') : val),
});
export type QuotationFormData = z.infer<typeof QuotationFormSchema>;
