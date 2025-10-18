'use server';

// DAL (Data Access Layer) - MS SQL IMPLEMENTATION
// This layer is responsible for all communication with the database.
require('dotenv').config({ path: require('path').resolve(process.cwd(), '.env') });

import sql from 'mssql';
import type { Project, Client } from './types';
import type { ClientCreateDto, ClientUpdateDto } from './bll/client-bll';

const config = {
  connectionString: process.env.DATABASE_URL,
};

let pool: sql.ConnectionPool | null = null;

async function getDb(): Promise<sql.ConnectionPool> {
  if (pool && pool.connected) {
    return pool;
  }
  if (!config.connectionString) {
    // Throw an error if the connection string is not set.
    throw new Error("DATABASE_URL environment variable is not set. The application cannot connect to the database.");
  }
  try {
    pool = await sql.connect(config.connectionString);
    return pool;
  } catch (err) {
    console.error('Database connection failed:', err);
    // Important: re-throw the error to ensure the calling function knows about the failure.
    throw new Error('Failed to connect to the database.');
  }
}

// --- Project Functions ---

export async function findManyProjects(): Promise<Project[]> {
    const db = await getDb();
    const result = await db.request().query('SELECT * FROM Projects');
    // In a real app, you would parse tasks and updates which might be stored as JSON
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
   const newId = `cl${Date.now()}`;
   // The avatar URL is now generated here, but it could come from an external service.
   const avatarUrl = `https://picsum.photos/seed/${newId}/100/100`;

   const query = `
    INSERT INTO Clients (id, name, email, phone, company, status, avatarUrl)
    OUTPUT INSERTED.*
    VALUES (@id, @name, @email, @phone, @company, @status, @avatarUrl);
   `;

   try {
     const result = await db.request()
       .input('id', sql.VarChar, newId)
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
            SET name = @name, email = @email, phone = @phone, company = @company, status = @status
            OUTPUT INSERTED.*
            WHERE id = @id
        `);
    return result.recordset[0];
}

export async function deleteClient(id: string): Promise<void> {
    const db = await getDb();
    await db.request()
        .input('id', sql.VarChar, id)
        .query('DELETE FROM Clients WHERE id = @id');
}
