
'use server';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { join } from 'path';

let db: Awaited<ReturnType<typeof open>> | null = null;

async function getSqliteDb() {
  if (db) {
    return db;
  }

  const dbPath = join(process.cwd(), 'workspace/database.db');

  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    await initializeDb(db);
    return db;
  } catch (err) {
    console.error('SQLite connection failed:', err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to connect to the SQLite database: ${errorMessage}`);
  }
}

async function initializeDb(db: Awaited<ReturnType<typeof open>>) {
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

    CREATE TABLE IF NOT EXISTS Projects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        startDate TEXT,
        deadline TEXT,
        cost REAL,
        status TEXT,
        clientId TEXT,
        imageUrl TEXT,
        tasks TEXT DEFAULT '[]',
        updates TEXT DEFAULT '[]',
        contractorIds TEXT DEFAULT '[]',
        FOREIGN KEY (clientId) REFERENCES Clients(id)
    );
  `);

  const clients = [
    { id: 'c1', name: 'John Doe', email: 'john.doe@example.com', phone: '123-456-7890', company: 'Doe Corp', avatarUrl: '/avatars/john-doe.png', status: 'Active' },
    { id: 'c2', name: 'Jane Smith', email: 'jane.smith@example.com', phone: '098-765-4321', company: 'Smith & Co.', avatarUrl: '/avatars/jane-smith.png', status: 'Active' },
    { id: 'c3', name: 'Peter Jones', email: 'peter.jones@example.com', phone: '555-555-5555', company: 'Jones Inc.', avatarUrl: '/avatars/peter-jones.png', status: 'Inactive' }
  ];

  const clientStmt = await db.prepare("INSERT OR IGNORE INTO Clients (id, name, email, phone, company, avatarUrl, status) VALUES (?, ?, ?, ?, ?, ?, ?)");
  for (const client of clients) {
    await clientStmt.run(client.id, client.name, client.email, client.phone, client.company, client.avatarUrl, client.status);
  }
  await clientStmt.finalize();

  const projects = [
    { id: 'p1', name: 'Project Alpha', description: 'This is project Alpha.', startDate: '2024-01-01', deadline: '2024-06-30', cost: 10000, status: 'In Progress', clientId: 'c1', imageUrl: '/projects/alpha.jpg' },
    { id: 'p2', name: 'Project Beta', description: 'This is project Beta.', startDate: '2024-02-01', deadline: '2024-07-31', cost: 20000, status: 'On Hold', clientId: 'c2', imageUrl: '/projects/beta.jpg' },
    { id: 'p3', name: 'Project Gamma', description: 'This is project Gamma.', startDate: '2024-03-01', deadline: '2024-08-31', cost: 30000, status: 'Completed', clientId: 'c1', imageUrl: '/projects/gamma.jpg' }
  ];

  const projectStmt = await db.prepare("INSERT OR IGNORE INTO Projects (id, name, description, startDate, deadline, cost, status, clientId, imageUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
  for (const project of projects) {
    await projectStmt.run(project.id, project.name, project.description, project.startDate, project.deadline, project.cost, project.status, project.clientId, project.imageUrl);
  }
  await projectStmt.finalize();
}

export async function getDb() {
  return getSqliteDb();
}
