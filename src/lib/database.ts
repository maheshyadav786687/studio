
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
      // The tasks and updates are stored as JSON strings. We need to parse them.
      const tasks = JSON.parse(result.tasks || '[]');
      const updates = JSON.parse(result.updates || '[]');
      return { ...result, tasks, updates };
    }
    return undefined;
}


// --- Client Functions ---

export async function findManyClients(): Promise<Client[]> {
    const db = await getDb();
    const query = `
      SELECT 
        c.*, 
        IFNULL(p.projectsCount, 0) as projectsCount,
        IFNULL(s.sitesCount, 0) as sitesCount
      FROM Clients c
      LEFT JOIN (
        SELECT clientId, COUNT(*) as projectsCount 
        FROM Projects 
        GROUP BY clientId
      ) p ON c.id = p.clientId
      LEFT JOIN (
        SELECT clientId, COUNT(*) as sitesCount
        FROM Sites
        GROUP BY clientId
      ) s ON c.id = s.clientId;
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
    
    const sitesCountResult = await db.get('SELECT COUNT(*) as sitesCount FROM Sites WHERE clientId = ?', id);
    client.sitesCount = sitesCountResult.sitesCount || 0;
    
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
      c.email as clientEmail,
      IFNULL(p.projectsCount, 0) as projectsCount,
      IFNULL(q.quotationsCount, 0) as quotationsCount
    FROM Sites s
    JOIN Clients c ON s.clientId = c.id
    LEFT JOIN (
        SELECT siteId, COUNT(*) as projectsCount
        FROM Projects
        GROUP BY siteId
    ) p ON s.id = p.siteId
    LEFT JOIN (
        SELECT siteId, COUNT(*) as quotationsCount
        FROM Quotations
        GROUP BY siteId
    ) q ON s.id = q.siteId;
  `;
  const results = await db.all(query);
  return results.map(row => ({
    id: row.id,
    name: row.name,
    address: row.address,
    clientId: row.clientId,
    projectsCount: row.projectsCount,
    quotationsCount: row.quotationsCount,
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
        SELECT 
            s.*, 
            c.name as clientName, 
            c.email as clientEmail,
            IFNULL(p.projectsCount, 0) as projectsCount,
            IFNULL(q.quotationsCount, 0) as quotationsCount
        FROM Sites s
        JOIN Clients c ON s.clientId = c.id
        LEFT JOIN (
            SELECT siteId, COUNT(*) as projectsCount
            FROM Projects
            GROUP BY siteId
        ) p ON s.id = p.siteId
        LEFT JOIN (
            SELECT siteId, COUNT(*) as quotationsCount
            FROM Quotations
            GROUP BY siteId
        ) q ON s.id = q.siteId
        WHERE s.id = ?
    `;
    const row = await db.get(query, id);
    if (!row) return undefined;
    
    return {
        id: row.id,
        name: row.name,
        address: row.address,
        clientId: row.clientId,
        projectsCount: row.projectsCount,
        quotationsCount: row.quotationsCount,
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

// --- DB Initialization ---

export async function initializeDbSchema() {
    const db = await getDb();
    await db.exec(`
      CREATE TABLE IF NOT EXISTS Clients (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        phone TEXT,
        company TEXT,
        avatarUrl TEXT,
        status TEXT CHECK (status IN ('Active', 'Inactive'))
      );
  
      CREATE TABLE IF NOT EXISTS Sites (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        address TEXT NOT NULL,
        clientId TEXT NOT NULL,
        FOREIGN KEY (clientId) REFERENCES Clients(id) ON DELETE CASCADE
      );
  
      CREATE TABLE IF NOT EXISTS Projects (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          startDate TEXT,
          deadline TEXT,
          cost REAL,
          status TEXT,
          siteId TEXT,
          clientId TEXT,
          imageUrl TEXT,
          tasks TEXT DEFAULT '[]',
          updates TEXT DEFAULT '[]',
          contractorIds TEXT DEFAULT '[]',
          approvedQuotationIds TEXT DEFAULT '[]',
          FOREIGN KEY (siteId) REFERENCES Sites(id),
          FOREIGN KEY (clientId) REFERENCES Clients(id)
      );

      CREATE TABLE IF NOT EXISTS Quotations (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          status TEXT CHECK (status IN ('Draft', 'Sent', 'Approved', 'Rejected')),
          siteId TEXT NOT NULL,
          items TEXT DEFAULT '[]',
          FOREIGN KEY (siteId) REFERENCES Sites(id) ON DELETE CASCADE
      );
    `);
}
