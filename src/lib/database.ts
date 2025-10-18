
'use server';

// DAL (Data Access Layer) - SQLite IMPLEMENTATION
// This layer is responsible for all communication with the database.

import { getDb } from './db-provider';
import type { Project, Client, Site, SiteFormData } from './types';
import type { ClientCreateDto, ClientUpdateDto } from './bll/client-bll';
import type { SiteCreateDto, SiteUpdateDto } from './bll/site-bll';


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

export async function findClientById(id: string): Promise<Client | undefined> {
    const db = await getDb();
    const client = await db.get('SELECT * FROM Clients WHERE id = ?', id);
    if (!client) return undefined;

    const projectsCountResult = await db.get('SELECT COUNT(*) as projectsCount FROM Projects WHERE clientId = ?', id);
    client.projectsCount = projectsCountResult.projectsCount || 0;
    
    return client;
}

export async function findClientByEmail(email: string): Promise<Client | undefined> {
    const db = await getDb();
    const result = await db.get('SELECT * FROM Clients WHERE email = ?', email);
    return result;
}

export async function createClient(clientData: ClientCreateDto): Promise<Client> {
   const db = await getDb();
   const id = `cl-${Date.now()}`;
   const avatarUrl = `https://picsum.photos/seed/${id}/100/100`;

   const query = `
    INSERT INTO Clients (id, name, email, phone, company, status, avatarUrl)
    VALUES (?, ?, ?, ?, ?, ?, ?);
   `;

   try {
     await db.run(
       query,
       id,
       clientData.name,
       clientData.email,
       clientData.phone,
       clientData.company,
       clientData.status,
       avatarUrl
     );

    const newClient = await findClientById(id);
    return newClient!;

   } catch (error) {
     console.error("Failed to create client in database:", error);
     throw new Error("Database operation failed: Could not create client.");
   }
}


export async function updateClient(id: string, clientData: ClientUpdateDto): Promise<Client | undefined> {
    const db = await getDb();
    const query = `
            UPDATE Clients
            SET name = COALESCE(?, name), 
                email = COALESCE(?, email), 
                phone = COALESCE(?, phone), 
                company = COALESCE(?, company), 
                status = COALESCE(?, status)
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
     
    return await findClientById(id);
}

export async function deleteClient(id: string): Promise<void> {
    const db = await getDb();
    await db.run('DELETE FROM Clients WHERE id = ?', id);
}

// --- Site Functions ---

export async function findManySites(): Promise<Site[]> {
  const db = await getDb();
  const query = `
    SELECT 
      s.*,
      c.name as clientName,
      c.email as clientEmail
    FROM Sites s
    JOIN Clients c ON s.clientId = c.id;
  `;
  const results = await db.all(query);
  return results.map(row => ({
    id: row.id,
    name: row.name,
    address: row.address,
    clientId: row.clientId,
    client: {
        id: row.clientId,
        name: row.clientName,
        email: row.clientEmail,
        phone: '', 
        company: '',
        avatarUrl: '',
        projectsCount: 0,
        status: 'Active'
    }
  }));
}

export async function findSiteById(id: string): Promise<Site | undefined> {
    const db = await getDb();
    const query = `
        SELECT s.*, c.name as clientName, c.email as clientEmail
        FROM Sites s
        JOIN Clients c ON s.clientId = c.id
        WHERE s.id = ?
    `;
    const row = await db.get(query, id);
    if (!row) return undefined;
    
    return {
        id: row.id,
        name: row.name,
        address: row.address,
        clientId: row.clientId,
        client: {
            id: row.clientId,
            name: row.clientName,
            email: row.clientEmail,
            phone: '',
            company: '',
            avatarUrl: '',
            projectsCount: 0,
            status: 'Active'
        }
    };
}

export async function createSite(siteData: SiteCreateDto): Promise<Site> {
    const db = await getDb();
    const id = `site-${Date.now()}`;
    const query = `
        INSERT INTO Sites (id, name, address, clientId)
        VALUES (?, ?, ?, ?);
    `;
    await db.run(query, id, siteData.name, siteData.address, siteData.clientId);
    const newSite = await findSiteById(id);
    return newSite!;
}

export async function updateSite(id: string, siteData: SiteUpdateDto): Promise<Site | undefined> {
    const db = await getDb();
    const query = `
        UPDATE Sites
        SET name = COALESCE(?, name),
            address = COALESCE(?, address),
            clientId = COALESCE(?, clientId)
        WHERE id = ?;
    `;
    await db.run(query, siteData.name, siteData.address, siteData.clientId, id);
    return await findSiteById(id);
}

export async function deleteSite(id: string): Promise<void> {
    const db = await getDb();
    await db.run('DELETE FROM Sites WHERE id = ?', id);
}
