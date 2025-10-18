'use server';

// DAL (Data Access Layer) - MS SQL IMPLEMENTATION
// This layer is responsible for all communication with the database.

import sql from 'mssql';
import { getDb } from './db-provider';
import type { Project, Client } from './types';
import type { ClientCreateDto, ClientUpdateDto } from './bll/client-bll';


// --- Project Functions ---

export async function findManyProjects(): Promise<Project[]> {
    const db = await getDb();
    const result = await db.request().query('SELECT * FROM Projects');
    // In a real app, you would parse tasks and updates which might be stored as JSON
    // For now, returning empty arrays for simplicity.
    return result.recordset.map(p => ({ ...p, tasks: [], updates: [] }));
}

export async function findProjectById(id: string): Promise<Project | undefined> {
    const db = await getDb();
    const result = await db.request()
        .input('id', sql.VarChar, id)
        .query('SELECT * FROM Projects WHERE id = @id');
    const project = result.recordset[0];
    if (project) {
       // In a real app, you would parse tasks and updates which might be stored as JSON
      return { ...project, tasks: [], updates: [] };
    }
    return undefined;
}


// --- Client Functions ---

export async function findManyClients(): Promise<Client[]> {
    const db = await getDb();
    // This query joins Clients with a subquery that counts projects for each client.
    const query = `
      SELECT 
        c.*, 
        ISNULL(p.projectsCount, 0) as projectsCount 
      FROM Clients c
      LEFT JOIN (
        SELECT clientId, COUNT(*) as projectsCount 
        FROM Projects 
        GROUP BY clientId
      ) p ON c.id = p.clientId;
    `;
    const result = await db.request().query(query);
    return result.recordset;
}

export async function findClientByEmail(email: string): Promise<Client | undefined> {
    const db = await getDb();
    const result = await db.request()
        .input('email', sql.VarChar, email)
        .query('SELECT * FROM Clients WHERE email = @email');
    return result.recordset[0];
}

export async function createClient(clientData: ClientCreateDto): Promise<Client> {
   const db = await getDb();
   // The avatar URL is now generated here, but it could come from an external service.
   const avatarUrl = `https://picsum.photos/seed/${Date.now()}/100/100`;

   const query = `
    INSERT INTO Clients (name, email, phone, company, status, avatarUrl)
    OUTPUT INSERTED.*
    VALUES (@name, @email, @phone, @company, @status, @avatarUrl);
   `;

   try {
     const result = await db.request()
       .input('name', sql.NVarChar, clientData.name)
       .input('email', sql.NVarChar, clientData.email)
       .input('phone', sql.VarChar, clientData.phone)
       .input('company', sql.NVarChar, clientData.company)
       .input('status', sql.VarChar, clientData.status)
       .input('avatarUrl', sql.VarChar, avatarUrl)
       .query(query);

    const newClient = result.recordset[0];
    // The query returns the new row, but we need to ensure projectsCount is there.
    // Since it's a new client, the count is 0.
    return { ...newClient, projectsCount: 0 };

   } catch (error) {
     console.error("Failed to create client in database:", error);
     // Re-throw a more user-friendly error to be caught by the BLL/API layer
     throw new Error("Database operation failed: Could not create client.");
   }
}


export async function updateClient(id: string, clientData: ClientUpdateDto): Promise<Client | undefined> {
    const db = await getDb();
    const result = await db.request()
        .input('id', sql.VarChar, id)
        .input('name', sql.NVarChar, clientData.name)
        .input('email', sql.NVarChar, clientData.email)
        .input('phone', sql.VarChar, clientData.phone)
        .input('company', sql.NVarChar, clientData.company)
        .input('status', sql.VarChar, clientData.status)
        .query(`
            UPDATE Clients
            SET name = ISNULL(@name, name), 
                email = ISNULL(@email, email), 
                phone = ISNULL(@phone, phone), 
                company = ISNULL(@company, company), 
                status = ISNULL(@status, status)
            OUTPUT INSERTED.*
            WHERE id = @id
        `);
     
    if (result.recordset.length > 0) {
      // We need to get the project count as the UPDATE query doesn't return it.
      const projectsResult = await db.request()
        .input('id', sql.VarChar, id)
        .query('SELECT COUNT(*) as projectsCount FROM Projects WHERE clientId = @id');
      const projectsCount = projectsResult.recordset[0].projectsCount;
      return { ...result.recordset[0], projectsCount };
    }

    return undefined;
}

export async function deleteClient(id: string): Promise<void> {
    const db = await getDb();
    
    // You might want to handle related projects first, e.g., set clientId to NULL or delete them.
    // For this example, we'll just delete the client.
    
    await db.request()
        .input('id', sql.VarChar, id)
        .query('DELETE FROM Clients WHERE id = @id');
}
