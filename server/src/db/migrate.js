import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool, query } from './pool.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function runMigration() {
  console.log('--- Running PostgreSQL Schema Migrations ---');
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');

  try {
    if (pool) {
      await pool.query(schemaSql);
      console.log('✓ PostgreSQL schema applied successfully.');
    } else {
      console.log('ℹ No PostgreSQL connection string configured. Using in-memory store.');
    }
  } catch (err) {
    console.error('Migration error:', err.message);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runMigration().then(() => {
    if (pool) pool.end();
  });
}
