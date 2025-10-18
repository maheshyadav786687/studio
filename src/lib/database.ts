'use server';

// DAL (Data Access Layer)
// This layer is responsible for all communication with the database.
// It should only be called by the BLL.

// Load environment variables directly here to ensure they are available.
import 'dotenv/config';

import sql from 'mssql';
import type { Project, Client } from './types';
import type { ClientCreateDto, ClientUpdateDto } from './bll/client-bll';

const config = {
  connectionString: process.env.DATABASE_URL,
};

// In a real production app, you might want to manage a connection pool
// more carefully, but for this purpose, creating a new pool on demand is fine.
const getDb = async () => {
    if (!config.connectionString) {
      // Throw an error if the connection string is not set.
      throw new Error("DATABASE_URL environment variable is not set. The application cannot connect to the database.");
    }
    try {
        const pool = await sql.connect(config.connectionString);
        return pool;
    } catch (err) {
        console.error("Database connection failed:", err);
        // Re-throw the error to be caught by the calling layer.
        throw new Error(`Database connection failed. Please check your connection string and network access. Original error: ${err instanceof Error ? err.message : String(err)}`);
    }
}


/**
 * NOTE: The queries below assume you have created the necessary tables from schema.sql
 * The project-related queries assume that `tasks` and `updates` are stored as JSON strings.
 * This is a simplification. In a real-world scenario, you would have separate tables for Tasks and Updates.
 */

// --- Project Functions ---

export async function findManyProjects(): Promise<Project[]> {
    const pool = await getDb();
    const result = await pool.request().query`SELECT * FROM Projects`;
    return result.recordset.map(p => ({
        ...p,
        tasks: JSON.parse(p.tasks || '[]'),
        updates: JSON.parse(p.updates || '[]'),
    })) as Project[];
}

export async function findProjectById(id: string): Promise<Project | undefined> {
    const pool = await getDb();
    const result = await pool.request()
    .input('id', sql.NVarChar, id)
    .query`SELECT * FROM Projects WHERE id = @id`;
    
    if (result.recordset.length === 0) {
    return undefined;
    }
    const p = result.recordset[0];
    return {
        ...p,
        tasks: JSON.parse(p.tasks || '[]'),
        updates: JSON.parse(p.updates || '[]'),
    } as Project;
}


// --- Client Functions ---

export async function findManyClients(): Promise<Client[]> {
    const pool = await getDb();
    // A more complex query to calculate projectsCount on the fly
    const result = await pool.request().query`
    SELECT 
        c.*, 
        (SELECT COUNT(*) FROM Projects p WHERE c.id = p.clientId) as projectsCount 
    FROM Clients c
    `;
    return result.recordset as Client[];
}

export async function findClientByEmail(email: string): Promise<Client | undefined> {
    const pool = await getDb();
    const result = await pool.request()
    .input('email', sql.NVarChar, email)
    .query`SELECT * FROM Clients WHERE email = @email`;
    return result.recordset[0] as Client | undefined;
}

export async function createClient(clientData: ClientCreateDto): Promise<Client> {
    const pool = await getDb();
    const newId = `cl${Date.now()}`;
    const avatarUrl = `https://picsum.photos/seed/${Date.now()}/100/100`;

    try {
        await pool.request()
            .input('id', sql.NVarChar, newId)
            .input('name', sql.NVarChar, clientData.name)
            .input('email', sql.NVarChar, clientData.email)
            .input('phone', sql.NVarChar, clientData.phone)
            .input('company', sql.NVarChar, clientData.company)
            .input('avatarUrl', sql.NVarChar, avatarUrl)
            .input('status', sql.NVarChar, clientData.status)
            .query`INSERT INTO Clients (id, name, email, phone, company, avatarUrl, status, projectsCount) VALUES (@id, @name, @email, @phone, @company, @avatarUrl, @status, 0)`;

        const newClient: Client = {
          ...clientData,
          id: newId,
          avatarUrl: avatarUrl,
          projectsCount: 0,
        };

        return newClient;
    } catch (err) {
        console.error("Failed to insert client into database:", err);
        // Ensure a meaningful error is thrown to the BLL/API layers
        throw new Error(`Database query failed. Could not create client. Make sure the 'Clients' table exists and check columns. Original error: ${err instanceof Error ? err.message : String(err)}`);
    }
}

export async function updateClient(id: string, clientData: ClientUpdateDto): Promise<Client | undefined> {
    const pool = await getDb();
    
    const setClauses = Object.keys(clientData)
    .map(key => `${key} = @${key}`)
    .join(', ');

    if (!setClauses) return undefined;

    const request = pool.request().input('id', sql.NVarChar, id);
    for (const [key, value] of Object.entries(clientData)) {
        // Ensure that the type is correctly inferred for mssql
        let fieldType;
        switch(typeof value) {
            case 'number':
                fieldType = sql.Int;
                break;
            default:
                fieldType = sql.NVarChar;
        }
        request.input(key, fieldType, value);
    }

    await request.query(`UPDATE Clients SET ${setClauses} WHERE id = @id`);

    const result = await pool.request()
        .input('id', sql.NVarChar, id)
        .query`SELECT *, (SELECT COUNT(*) FROM Projects p WHERE p.clientId = c.id) as projectsCount FROM Clients c WHERE c.id = @id`;

    return result.recordset[0] as Client | undefined;
}

export async function deleteClient(id: string): Promise<void> {
    const pool = await getDb();
    await pool.request()
    .input('id', sql.NVarChar, id)
    .query`DELETE FROM Clients WHERE id = @id`;
}
