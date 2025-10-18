// BLL (Business Logic Layer)
// This layer contains the core business logic.
// It acts as an intermediary between the API layer and the DAL.

'use server';

import { db } from '@/lib/database';
import type { Client } from '@/lib/types';
import { z } from 'zod';
import { ClientSchema } from '@/lib/types';

type ClientCreateDto = Omit<Client, 'id' | 'avatarUrl' | 'projectsCount'>;
type ClientUpdateDto = Partial<ClientCreateDto>;


// BLL function to get all clients
export async function getClients(): Promise<Client[]> {
  // BLL calls the DAL
  const clients = await db.clients.findMany();
  // Here you could add business logic, e.g., filtering, sorting, transforming data.
  // For now, we'll just return the DTOs from the DAL.
  return clients;
}

// BLL function to create a client
export async function createClient(clientDto: ClientCreateDto): Promise<Client> {
  // BLL validates business rules (can be more complex than just schema validation)
  const validatedDto = ClientSchema.omit({ id: true, avatarUrl: true, projectsCount: true }).parse(clientDto);

  // Business logic: e.g. check for duplicate emails
  const existingClient = await db.clients.findByEmail(validatedDto.email);
  if (existingClient) {
    throw new Error('A client with this email already exists.');
  }

  // BLL converts DTO to a model if necessary and calls DAL
  const newClient = await db.clients.create(validatedDto);

  // BLL returns a DTO
  return newClient;
}

// BLL function to update a client
export async function updateClient(id: string, clientDto: ClientUpdateDto): Promise<Client | undefined> {
  // BLL validates business rules
  const validatedDto = ClientSchema.partial().parse(clientDto);
  
  // BLL calls DAL
  const updatedClient = await db.clients.update(id, validatedDto);
  
  // BLL returns a DTO
  return updatedClient;
}

// BLL function to delete a client
export async function deleteClient(id: string): Promise<void> {
  // Business logic: e.g., check if client has active projects before deleting
  // (We'll skip this for now, but this is where it would go)

  // BLL calls DAL
  await db.clients.delete(id);
}
