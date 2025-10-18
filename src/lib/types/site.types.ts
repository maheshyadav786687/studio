
import { z } from 'zod';
// We have to import the schemas this way to avoid circular dependencies.
// We can't use a barrel file (index.ts) in this case.
import { ProjectSchema } from './project.types';
import { QuotationSchema } from './quotation.types';
import { ClientSchema } from './client.types';


export const SiteSchema = z.object({
  id: z.string(),
  name: z.string().min(2, 'Site name must be at least 2 characters.'),
  address: z.string().min(5, 'Address must be at least 5 characters.'),
  clientId: z.string({ required_error: 'Client is required.' }),
  quotations: z.array(z.lazy(() => QuotationSchema)).optional(),
  projects: z.array(z.lazy(() => ProjectSchema)).optional(),
  client: z.lazy(() => ClientSchema).optional(),
  projectsCount: z.number().int().optional(),
  quotationsCount: z.number().int().optional(),
});

export type Site = z.infer<typeof SiteSchema>;

export const SiteFormSchema = SiteSchema.omit({ id: true, quotations: true, projects: true, client: true, projectsCount: true, quotationsCount: true });
export type SiteFormData = z.infer<typeof SiteFormSchema>;
