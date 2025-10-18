'use server';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { join } from 'path';

let db: Awaited<ReturnType<typeof open>> | null = null;
let seedingDone = false;

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
    DROP TABLE IF EXISTS Quotations;
    DROP TABLE IF EXISTS Projects;
    DROP TABLE IF EXISTS Sites;
    DROP TABLE IF EXISTS Clients;

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

  if (seedingDone) {
    return;
  }

  const clientsCount = await db.get('SELECT COUNT(*) as count FROM Clients');
  if (clientsCount.count === 0) {
    const clients = [
      { id: 'cl-1', name: 'John Doe', email: 'john.doe@example.com', phone: '123-456-7890', company: 'Doe Corp', avatarUrl: 'https://picsum.photos/seed/c1/100/100', status: 'Active' },
      { id: 'cl-2', name: 'Jane Smith', email: 'jane.smith@example.com', phone: '098-765-4321', company: 'Smith & Co.', avatarUrl: 'https://picsum.photos/seed/c2/100/100', status: 'Active' },
      { id: 'cl-3', name: 'Peter Jones', email: 'peter.jones@example.com', phone: '555-555-5555', company: 'Jones Inc.', avatarUrl: 'https://picsum.photos/seed/c3/100/100', status: 'Inactive' }
    ];
    const clientStmt = await db.prepare("INSERT INTO Clients (id, name, email, phone, company, avatarUrl, status) VALUES (?, ?, ?, ?, ?, ?, ?)");
    for (const client of clients) {
      await clientStmt.run(client.id, client.name, client.email, client.phone, client.company, client.avatarUrl, client.status);
    }
    await clientStmt.finalize();
  }


  const sitesCount = await db.get('SELECT COUNT(*) as count FROM Sites');
  if (sitesCount.count === 0) {
    const sites = [
      { id: 'site-1', name: 'Headquarters', address: '123 Main St, Anytown', clientId: 'cl-1' },
      { id: 'site-2', name: 'Downtown Branch', address: '456 Oak Ave, Anytown', clientId: 'cl-2' },
      { id: 'site-3', name: 'Warehouse Facility', address: '789 Pine Ln, Anytown', clientId: 'cl-1' }
    ];
    const siteStmt = await db.prepare("INSERT INTO Sites (id, name, address, clientId) VALUES (?, ?, ?, ?)");
    for (const site of sites) {
      await siteStmt.run(site.id, site.name, site.address, site.clientId);
    }
    await siteStmt.finalize();
  }


  const projectsCount = await db.get('SELECT COUNT(*) as count FROM Projects');
  if (projectsCount.count === 0) {
    const projects = [
      { id: 'p1', name: 'Corporate Website Redesign', description: 'A complete overhaul of the corporate website to improve user experience and modernize the design.', startDate: '2024-05-01', deadline: '2024-08-31', cost: 500000, status: 'In Progress', siteId: 'site-1', clientId: 'cl-1', imageUrl: 'https://picsum.photos/seed/project1/600/400' },
      { id: 'p2', name: 'Mobile App Development', description: 'A new cross-platform mobile application for task management.', startDate: '2024-06-15', deadline: '2024-12-15', cost: 1200000, status: 'In Progress', siteId: 'site-2', clientId: 'cl-2', imageUrl: 'https://picsum.photos/seed/project2/600/400' },
      { id: 'p3', name: 'E-commerce Platform', description: 'Building a scalable e-commerce platform with advanced features.', startDate: '2024-07-01', deadline: '2025-01-31', cost: 2500000, status: 'Not Started', siteId: 'site-3', clientId: 'cl-1', imageUrl: 'https://picsum.photos/seed/project3/600/400' },
      { id: 'p4', name: 'Internal CRM Tool', description: 'An internal tool for customer relationship management.', startDate: '2024-03-01', deadline: '2024-07-30', cost: 800000, status: 'Completed', siteId: 'site-1', clientId: 'cl-1', imageUrl: 'https://picsum.photos/seed/project4/600/400' }
    ];
    const projectStmt = await db.prepare("INSERT INTO Projects (id, name, description, startDate, deadline, cost, status, siteId, clientId, imageUrl, tasks, updates) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    for (const p of projects) {
        // Here we add some default tasks and updates as stringified JSON
        const tasks = JSON.stringify([
            { id: `${p.id}-t1`, title: 'Initial Planning', description: 'Gather requirements and create a project plan.', status: 'Done', quotationItemId: 'qi-1' },
            { id: `${p.id}-t2`, title: 'Design Phase', description: 'Create wireframes and mockups.', status: 'In Progress', quotationItemId: 'qi-2' }
        ]);
        const updates = JSON.stringify([
            { id: `${p.id}-u1`, date: '2024-07-25T10:00:00Z', content: 'Project kick-off meeting held. Initial requirements gathered.', author: 'Admin', authorAvatar: 'https://picsum.photos/seed/admin/100/100' }
        ]);
        await projectStmt.run(p.id, p.name, p.description, p.startDate, p.deadline, p.cost, p.status, p.siteId, p.clientId, p.imageUrl, tasks, updates);
    }
    await projectStmt.finalize();
  }

  const quotationsCount = await db.get('SELECT COUNT(*) as count FROM Quotations');
    if (quotationsCount.count === 0) {
        const quotations = [
            { id: 'q1', title: 'Quotation for Website Redesign', status: 'Approved', siteId: 'site-1' },
            { id: 'q2', title: 'Quotation for Mobile App', status: 'Sent', siteId: 'site-2' },
            { id: 'q3', title: 'Quotation for E-commerce Platform', status: 'Draft', siteId: 'site-3' },
        ];
        const quoteStmt = await db.prepare("INSERT INTO Quotations (id, title, status, siteId) VALUES (?, ?, ?, ?)");
        for (const q of quotations) {
            await quoteStmt.run(q.id, q.title, q.status, q.siteId);
        }
        await quoteStmt.finalize();
    }

  seedingDone = true;
}

export async function getDb() {
  return getSqliteDb();
}