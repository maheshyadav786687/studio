import { z } from 'zod';
import type { Site } from './project.types';

export const ClientSchema = z.object({
  id: z.string(),
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits.'),
  company: z.string().min(2, 'Company name is required.'),
  avatarUrl: z.string().url(),
  projectsCount: z.number().int(),
  status: z.enum(['Active', 'Inactive']),
  sites: z.array(z.lazy(() => SiteSchema)).optional(),
});

export type Client = z.infer<typeof ClientSchema>;

// This is the DTO for the form, which doesn't include server-generated fields.
export const ClientFormSchema = ClientSchema.omit({ id: true, avatarUrl: true, projectsCount: true, sites: true });
export type ClientFormData = z.infer<typeof ClientFormSchema>;

// Forward-declare SiteSchema here to avoid circular dependency issues if needed, though lazy should handle it.
const SiteSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  clientId: z.string(),
  quotations: z.array(z.lazy(() => QuotationSchema)).optional(),
  projects: z.array(z.lazy(() => ProjectSchema)).optional(),
});
import { ProjectSchema, QuotationSchema } from './project.types';
