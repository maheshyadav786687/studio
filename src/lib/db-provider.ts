// This file is responsible for providing the correct database client
// based on the connection string.
'use server';
import sql from 'mssql';

let pool: sql.ConnectionPool | null = null;

async function getMssqlDb(): Promise<sql.ConnectionPool> {
  if (pool && pool.connected) {
    return pool;
  }
  
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set. The application cannot connect to the database.");
  }

  try {
    pool = await sql.connect(connectionString);
    return pool;
  } catch (err) {
    console.error('MS SQL connection failed:', err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to connect to the MS SQL database: ${errorMessage}`);
  }
}

// This function will determine which DB provider to use.
// For now, it only supports mssql.
export async function getDb() {
  const connectionString = process.env.DATABASE_URL || '';

  // In the future, you could inspect the connection string to decide which DB to use.
  // e.g., if (connectionString.startsWith('postgres://')) { /* use pg */ }
  
  // Defaulting to MS SQL Server for now.
  return getMssqlDb();
}
