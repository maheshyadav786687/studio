
// DAL (Data Access Layer) for Clients

import { prisma } from '@/lib/prisma';
import type { Client, ClientFormData } from '@/lib/types';

// This is a placeholder for the company ID. In a real application, this
// would be retrieved from the user's session or authentication context.
const COMPANY_ID = '49397632-3864-4c53-A227-2342879B5841'; // Hardcoded company ID

// DAL function to get all clients
export async function findManyClients(): Promise<Client[]> {
  const clients = await prisma.client.findMany({
    include: {
      _count: {
        select: { Sites: true },
      },
    },
  });

  return clients.map(client => ({
    ...client,
    sitesCount: client._count.Sites,
  }));
}

// DAL function to get a single client by its ID
export async function findClientById(id: string): Promise<Client | undefined> {
    const client = await prisma.client.findUnique({
        where: { Id: id },
        include: {
            _count: {
                select: { Sites: true },
            },
        },
    });

    if (client) {
        return {
            ...client,
            sitesCount: client._count.Sites,
        };
    }
}

// DAL function to get a single client by its email
export async function findClientByEmail(email: string): Promise<Client | undefined> {
    const client = await prisma.client.findUnique({
        where: { Email: email },
    });
    return client || undefined;
}

// DAL function to create a new client
export async function createClient(clientData: ClientFormData): Promise<Client> {
  const client = await prisma.client.create({
    data: {
        ...clientData,
        CompanyId: COMPANY_ID,
    },
  });
  return client;
}

// DAL function to update an existing client
export async function updateClient(id: string, clientData: Partial<ClientFormData>): Promise<Client> {
  const client = await prisma.client.update({
    where: { Id: id },
    data: clientData,
  });
  return client;
}

// DAL function to delete a client
export async function deleteClient(id: string): Promise<void> {
  await prisma.client.delete({
    where: { Id: id },
  });
}
