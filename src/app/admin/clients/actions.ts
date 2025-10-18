'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/database';

const clientSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required.'),
  email: z.string().email('Invalid email address.'),
  phone: z.string().min(1, 'Phone is required.'),
  company: z.string().min(1, 'Company is required.'),
  status: z.enum(['Active', 'Inactive']),
});

export async function saveClientAction(prevState: any, formData: FormData) {
  const validatedFields = clientSchema.safeParse({
    id: formData.get('id') || undefined,
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    company: formData.get('company'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation failed.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { id, ...clientData } = validatedFields.data;

  try {
    if (id) {
      // Update existing client
      await db.clients.update(id, clientData);
    } else {
      // Create new client
      await db.clients.create(clientData);
    }
    revalidatePath('/admin/clients');
    return { message: 'Client saved successfully.', errors: {} };
  } catch (error) {
    console.error(error);
    return { message: 'Failed to save client.', errors: {} };
  }
}

export async function deleteClientAction(clientId: string) {
    if (!clientId) {
        return { message: 'Client ID is required.' };
    }
    try {
        await db.clients.delete(clientId);
        revalidatePath('/admin/clients');
        return { message: 'Client deleted successfully.' };
    } catch (error) {
        console.error(error);
        return { message: 'Failed to delete client.' };
    }
}
