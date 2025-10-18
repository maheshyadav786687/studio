
'use server';

// DAL (Data Access Layer) - SQLite IMPLEMENTATION
// This layer is responsible for all communication with the database.

import { getDb } from './db-provider';
import type { Project, Client, Site, SiteFormData, Quotation, QuotationItem } from './types';
import type { ClientCreateDto, ClientUpdateDto } from './bll/client-bll';
import type { SiteCreateDto, SiteUpdateDto } from './bll/site-bll';
import type { QuotationCreateDto, QuotationUpdateDto } from './bll/quotation-bll';


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
        sitesCount: 0,
        status: 'Active'
    }
  }));
}

export async function findManySitesGroupedByClient() {
    const db = await getDb();
    const query = `
      SELECT 
        c.id as clientId,
        c.name as clientName,
        s.id as siteId,
        s.name as siteName
      FROM Clients c
      JOIN Sites s ON c.id = s.clientId
      ORDER BY c.name, s.name;
    `;
    const rows = await db.all(query);
    
    const grouped: Record<string, { clientName: string, sites: { id: string, name: string }[] }> = {};
    
    rows.forEach(row => {
      if (!grouped[row.clientId]) {
        grouped[row.clientId] = {
          clientName: row.clientName,
          sites: []
        };
      }
      grouped[row.clientId].sites.push({
        id: row.siteId,
        name: row.siteName
      });
    });
    
    return Object.values(grouped);
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
            sitesCount: 0,
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

// --- Quotation Functions ---

export async function findManyQuotations(): Promise<Quotation[]> {
    const db = await getDb();
    const query = `
        SELECT 
            q.*,
            s.name as siteName,
            c.name as clientName
        FROM Quotations q
        JOIN Sites s ON q.siteId = s.id
        JOIN Clients c ON s.clientId = c.id
        ORDER BY q.quotationDate DESC;
    `;
    const quotations = await db.all(query);

    for (const quotation of quotations) {
        const items = await db.all('SELECT * FROM QuotationItems WHERE quotationId = ?', quotation.id);
        quotation.items = items.map(item => ({ ...item, material: !!item.material }));
    }

    return quotations;
}

export async function findQuotationById(id: string): Promise<Quotation | undefined> {
    const db = await getDb();
    const query = `
        SELECT 
            q.*,
            s.name as siteName,
            c.name as clientName
        FROM Quotations q
        JOIN Sites s ON q.siteId = s.id
        JOIN Clients c ON s.clientId = c.id
        WHERE q.id = ?;
    `;
    const row = await db.get(query, id);
    if (!row) return undefined;

    const items = await db.all('SELECT * FROM QuotationItems WHERE quotationId = ?', id);
    row.items = items.map(item => ({ ...item, material: !!item.material }));

    return row;
}

async function getNextQuotationNumber(): Promise<string> {
    const db = await getDb();
    const currentYear = new Date().getFullYear();
    const prefix = `QUO-${currentYear}-`;

    const lastQuotation = await db.get(
        "SELECT quotationNumber FROM Quotations WHERE quotationNumber LIKE ? ORDER BY quotationNumber DESC LIMIT 1",
        `${prefix}%`
    );

    let nextSequence = 1;
    if (lastQuotation) {
        const lastSequence = parseInt(lastQuotation.quotationNumber.split('-').pop() || '0', 10);
        nextSequence = lastSequence + 1;
    }
    
    return `${prefix}${nextSequence.toString().padStart(4, '0')}`;
}

export async function createQuotation(quotationData: QuotationCreateDto): Promise<Quotation> {
    const db = await getDb();
    const id = `quote-${Date.now()}`;
    const quotationNumber = await getNextQuotationNumber();
    
    await db.run('BEGIN TRANSACTION');
    try {
        const query = `
            INSERT INTO Quotations (id, quotationNumber, quotationDate, title, status, siteId)
            VALUES (?, ?, ?, ?, ?, ?);
        `;
        await db.run(query, id, quotationNumber, quotationData.quotationDate, quotationData.title, quotationData.status, quotationData.siteId);

        if (quotationData.items) {
            for (const item of quotationData.items) {
                const itemQuery = `
                    INSERT INTO QuotationItems (id, quotationId, description, quantity, unit, rate, amount, area, material)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
                `;
                const amount = (item.area && item.area > 0) ? (item.quantity || 0) * (item.rate || 0) * item.area : (item.quantity || 0) * (item.rate || 0);
                await db.run(itemQuery, `item-${Date.now()}-${Math.random()}`, id, item.description, item.quantity, item.unit, item.rate, amount, item.area, item.material ? 1 : 0);
            }
        }

        await db.run('COMMIT');
        const newQuotation = await findQuotationById(id);
        return newQuotation!;
    } catch (e) {
        await db.run('ROLLBACK');
        throw e;
    }
}

export async function updateQuotation(id: string, quotationData: QuotationUpdateDto): Promise<Quotation | undefined> {
    const db = await getDb();
    await db.run('BEGIN TRANSACTION');
    try {
        const query = `
            UPDATE Quotations
            SET title = COALESCE(?, title),
                quotationDate = COALESCE(?, quotationDate),
                status = COALESCE(?, status),
                siteId = COALESCE(?, siteId)
            WHERE id = ?;
        `;
        await db.run(query, quotationData.title, quotationData.quotationDate, quotationData.status, quotationData.siteId, id);

        if (quotationData.items) {
            await db.run('DELETE FROM QuotationItems WHERE quotationId = ?', id);
            for (const item of quotationData.items) {
                const itemQuery = `
                    INSERT INTO QuotationItems (id, quotationId, description, quantity, unit, rate, amount, area, material)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
                `;
                const amount = (item.area && item.area > 0) ? (item.quantity || 0) * (item.rate || 0) * item.area : (item.quantity || 0) * (item.rate || 0);
                await db.run(itemQuery, `item-${Date.now()}-${Math.random()}`, id, item.description, item.quantity, item.unit, item.rate, amount, item.area, item.material ? 1 : 0);
            }
        }
        await db.run('COMMIT');
        return await findQuotationById(id);
    } catch (e) {
        await db.run('ROLLBACK');
        throw e;
    }
}

export async function deleteQuotation(id: string): Promise<void> {
    const db = await getDb();
    await db.run('DELETE FROM Quotations WHERE id = ?', id);
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
          quotationNumber TEXT NOT NULL UNIQUE,
          quotationDate TEXT NOT NULL,
          title TEXT NOT NULL,
          status TEXT CHECK (status IN ('Draft', 'Sent', 'Approved', 'Rejected')),
          siteId TEXT NOT NULL,
          FOREIGN KEY (siteId) REFERENCES Sites(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS QuotationItems (
        id TEXT PRIMARY KEY,
        quotationId TEXT NOT NULL,
        description TEXT NOT NULL,
        quantity REAL NOT NULL,
        unit TEXT NOT NULL,
        rate REAL NOT NULL,
        amount REAL NOT NULL,
        area REAL,
        material INTEGER NOT NULL,
        FOREIGN KEY (quotationId) REFERENCES Quotations(id) ON DELETE CASCADE
      );
    `);
}
