import pkg from 'postgres';
const postgres = pkg;
import * as schema from '@shared/schema';

const connectionString = process.env.DATABASE_URL;

let db: any = null;

if (connectionString) {
  try {
    const sql = postgres(connectionString);
    db = sql; // Use raw postgres client for now
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    db = null;
  }
} else {
  console.log('No DATABASE_URL provided, using mock data');
}

export { db };