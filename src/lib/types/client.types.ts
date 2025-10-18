
import { z } from 'zod';

// We have to import the schemas this way to avoid circular dependencies.
// We can't use a barrel file (index.ts) in this case.
import { SiteSchema } from './site.types';

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

export const ClientFormSchema = ClientSchema.omit({ id: true, avatarUrl: true, projectsCount: true, sites: true });
export type ClientFormData = z.infer<typeof ClientFormSchema>;
