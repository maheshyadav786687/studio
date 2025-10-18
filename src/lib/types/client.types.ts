import { z } from 'zod';

export const ClientSchema = z.object({
  id: z.string(),
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits.'),
  company: z.string().min(2, 'Company name is required.'),
  avatarUrl: z.string().url(),
  projectsCount: z.number().int(),
  status: z.enum(['Active', 'Inactive']),
});

export type Client = z.infer<typeof ClientSchema>;
