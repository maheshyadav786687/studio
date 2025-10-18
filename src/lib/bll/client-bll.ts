// BLL (Business Logic Layer)
// This layer contains the core business logic.
// It acts as an intermediary between the API layer and the DAL.

'use server';

import { 
    findManyClients, 
    createClient as createDbClient,
    updateClient as updateDbClient,
    deleteClient as deleteDbClient,
    findClientByEmail
} from '@/lib/database';
import type { Client } from '@/lib/types';

export type ClientCreateDto = Omit<Client, 'id' | 'avatarUrl' | 'projectsCount'>;
export type ClientUpdateDto = Partial<ClientCreateDto>;


// BLL function to get all clients
export async function getClients(): Promise<Client[]> {
  // BLL calls the DAL
  const clients = await findManyClients();
  // Here you could add business logic, e.g., filtering, sorting, transforming data.
  // For now, we'll just return the DTOs from the DAL.
  return clients;
}

// BLL function to create a client
export async function createClient(clientDto: ClientCreateDto): Promise<Client> {
  // Business logic: e.g. check for duplicate emails
  const existingClient = await findClientByEmail(clientDto.email);
  if (existingClient) {
    throw new Error('A client with this email already exists.');
  }

  // BLL converts DTO to a model if necessary and calls DAL
  const newClient = await createDbClient(clientDto);

  // BLL returns a DTO
  return newClient;
}

// BLL function to update a client
export async function updateClient(id: string, clientDto: ClientUpdateDto): Promise<Client | undefined> {
  // BLL calls DAL
  const updatedClient = await updateDbClient(id, clientDto);
  
  // BLL returns a DTO
  return updatedClient;
}

// BLL function to delete a client
export async function deleteClient(id: string): Promise<void> {
  // Business logic: e.g., check if client has active projects before deleting
  // (We'll skip this for now, but this is where it would go)

  // BLL calls DAL
  await deleteDbClient(id);
}