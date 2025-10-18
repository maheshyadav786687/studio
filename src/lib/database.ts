'use server';

// DAL (Data Access Layer)
// This layer is responsible for all communication with the database.
// It should only be called by the BLL.

import sql from 'mssql';
import type { Project, Client } from './types';
import type { ClientCreateDto } from './bll/client-bll';

const config = {
  connectionString: process.env.DATABASE_URL,
};

if (!config.connectionString) {
  throw new Error('DATABASE_URL environment variable is not set.');
}

// In a real production app, you might want to manage a connection pool
// more carefully, but for this purpose, connecting on each request is fine.
const getDb = () => sql.connect(config);

/**
 * NOTE: The queries below assume you have created the necessary tables.
 * Example SQL for Clients table:
 * CREATE TABLE Clients (
 *   id NVARCHAR(50) PRIMARY KEY,
 *   name NVARCHAR(255) NOT NULL,
 *   email NVARCHAR(255) NOT NULL UNIQUE,
 *   phone NVARCHAR(50),
 *   company NVARCHAR(255),
 *   avatarUrl NVARCHAR(MAX),
 *   status NVARCHAR(20) CHECK (status IN ('Active', 'Inactive')),
 *   projectsCount INT DEFAULT 0
 * );
 * 
 * The project-related queries assume that `tasks` and `updates` are stored as JSON strings.
 * This is a simplification. In a real-world scenario, you would have separate tables for Tasks and Updates.
 */
export const db = {
  projects: {
    findMany: async (): Promise<Project[]> => {
      const pool = await getDb();
      const result = await pool.request().query`SELECT * FROM Projects`;
      return result.recordset.map(p => ({
          ...p,
          tasks: JSON.parse(p.tasks || '[]'),
          updates: JSON.parse(p.updates || '[]'),
          contractorIds: JSON.parse(p.contractorIds || '[]'),
      })) as Project[];
    },
    findById: async (id: string): Promise<Project | undefined> => {
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
          contractorIds: JSON.parse(p.contractorIds || '[]'),
      } as Project;
    },
  },
  clients: {
    findMany: async (): Promise<Client[]> => {
      const pool = await getDb();
      // A more complex query to calculate projectsCount on the fly
      const result = await pool.request().query`
        SELECT 
          c.*, 
          (SELECT COUNT(*) FROM Projects p WHERE c.id = p.clientId) as projectsCount 
        FROM Clients c
      `;
      return result.recordset as Client[];
    },
    findByEmail: async (email: string): Promise<Client | undefined> => {
      const pool = await getDb();
      const result = await pool.request()
        .input('email', sql.NVarChar, email)
        .query`SELECT * FROM Clients WHERE email = @email`;
      return result.recordset[0] as Client | undefined;
    },
    create: async (clientData: ClientCreateDto): Promise<Client> => {
      const pool = await getDb();
      const newId = `cl${Date.now()}`;
      const avatarUrl = `https://picsum.photos/seed/${Date.now()}/100/100`;

      await pool.request()
        .input('id', sql.NVarChar, newId)
        .input('name', sql.NVarChar, clientData.name)
        .input('email', sql.NVarChar, clientData.email)
        .input('phone', sql.NVarChar, clientData.phone)
        .input('company', sql.NVarChar, clientData.company)
        .input('avatarUrl', sql.NVarChar, avatarUrl)
        .input('status', sql.NVarChar, clientData.status)
        .query`INSERT INTO Clients (id, name, email, phone, company, avatarUrl, status) VALUES (@id, @name, @email, @phone, @company, @avatarUrl, @status)`;

      const newClient: Client = {
        ...clientData,
        id: newId,
        avatarUrl: avatarUrl,
        projectsCount: 0,
      };
      return newClient;
    },
    update: async (id: string, clientData: Partial<ClientCreateDto>): Promise<Client | undefined> => {
      const pool = await getDb();
      
      const setClauses = Object.keys(clientData)
        .map(key => `${key} = @${key}`)
        .join(', ');

      if (!setClauses) return undefined;

      const request = pool.request().input('id', sql.NVarChar, id);
      for (const [key, value] of Object.entries(clientData)) {
          request.input(key, sql.NVarChar, value);
      }

      await request.query(`UPDATE Clients SET ${setClauses} WHERE id = @id`);

      const result = await pool.request()
          .input('id', sql.NVarChar, id)
          .query`SELECT *, (SELECT COUNT(*) FROM Projects p WHERE p.clientId = c.id) as projectsCount FROM Clients c WHERE c.id = @id`;

      return result.recordset[0] as Client | undefined;
    },
    delete: async (id: string): Promise<void> => {
      const pool = await getDb();
      await pool.request()
        .input('id', sql.NVarChar, id)
        .query`DELETE FROM Clients WHERE id = @id`;
    }
  }
};
