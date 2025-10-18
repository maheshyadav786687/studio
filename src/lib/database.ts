
'use server';

// DAL (Data Access Layer) - SQLite IMPLEMENTATION
// This layer is responsible for all communication with the database.

import { getDb } from './db-provider';
import type { Project, Client } from './types';
import type { ClientCreateDto, ClientUpdateDto } from './bll/client-bll';


// --- Project Functions ---

export async function findManyProjects(): Promise<Project[]> {
    const db = await getDb();
    const result = await db.all('SELECT * FROM Projects');
    // For now, returning empty arrays for simplicity.
    return result.map(p => ({ ...p, tasks: [], updates: [] }));
}

export async function findProjectById(id: string): Promise<Project | undefined> {
    const db = await getDb();
    const result = await db.get('SELECT * FROM Projects WHERE id = ?', id);
    if (result) {
      return { ...result, tasks: [], updates: [] };
    }
    return undefined;
}


// --- Client Functions ---

export async function findManyClients(): Promise<Client[]> {
    const db = await getDb();
    const query = `
      SELECT 
        c.*, 
        IFNULL(p.projectsCount, 0) as projectsCount 
      FROM Clients c
      LEFT JOIN (
        SELECT clientId, COUNT(*) as projectsCount 
        FROM Projects 
        GROUP BY clientId
      ) p ON c.id = p.clientId;
    `;
    const result = await db.all(query);
    return result;
}

export async function findClientByEmail(email: string): Promise<Client | undefined> {
    const db = await getDb();
    const result = await db.get('SELECT * FROM Clients WHERE email = ?', email);
    return result;
}

export async function createClient(clientData: ClientCreateDto): Promise<Client> {
   const db = await getDb();
   const avatarUrl = `https://picsum.photos/seed/${Date.now()}/100/100`;

   const query = `
    INSERT INTO Clients (name, email, phone, company, status, avatarUrl)
    VALUES (?, ?, ?, ?, ?, ?);
   `;

   try {
     const result = await db.run(
       query,
       clientData.name,
       clientData.email,
       clientData.phone,
       clientData.company,
       clientData.status,
       avatarUrl
     );

    const newClient = await db.get('SELECT * FROM Clients WHERE id = ?', result.lastID);
    return { ...newClient, projectsCount: 0 };

   } catch (error) {
     console.error("Failed to create client in database:", error);
     throw new Error("Database operation failed: Could not create client.");
   }
}


export async function updateClient(id: string, clientData: ClientUpdateDto): Promise<Client | undefined> {
    const db = await getDb();
    const query = `
            UPDATE Clients
            SET name = IFNULL(?, name), 
                email = IFNULL(?, email), 
                phone = IFNULL(?, phone), 
                company = IFNULL(?, company), 
                status = IFNULL(?, status)
            WHERE id = ?
        `;
    await db.run(
        query,
        clientData.name,
        clientData.email,
        clientData.phone,
        clientData.company,
        clientData.status,
        id
    );
     
    const updatedClient = await db.get('SELECT * FROM Clients WHERE id = ?', id);
    if (updatedClient) {
      const projectsResult = await db.get('SELECT COUNT(*) as projectsCount FROM Projects WHERE clientId = ?', id);
      const projectsCount = projectsResult.projectsCount;
      return { ...updatedClient, projectsCount };
    }

    return undefined;
}

export async function deleteClient(id: string): Promise<void> {
    const db = await getDb();
    await db.run('DELETE FROM Clients WHERE id = ?', id);
}
