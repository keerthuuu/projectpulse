import pg from 'pg';
import env from './env.js';

const { Pool } = pg;

// Render's free Postgres requires SSL, but with a self-signed style
// certificate chain, so we disable strict certificate checking.
// Localhost connections do not use SSL.
const useSSL = env.DATABASE_URL && !env.DATABASE_URL.includes('localhost');

export const pool = env.DATABASE_URL
  ? new Pool({
      connectionString: env.DATABASE_URL,
      ssl: useSSL ? { rejectUnauthorized: false } : false
    })
  : null;

if (pool) {
  pool.on('error', (err) => {
    console.error('Unexpected PostgreSQL pool error:', err.message);
  });
} else {
  console.log('🔌 PostgreSQL database is currently DISCONNECTED.');
}

// Small helper so controllers can do: import { query } from '../config/db.js'
export const query = (text, params) => {
  if (!pool) {
    throw new Error('PostgreSQL database is disconnected.');
  }
  return pool.query(text, params);
};

export default pool;
