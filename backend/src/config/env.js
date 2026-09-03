import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const env = {
  PORT: process.env.PORT || 5000,
  FRONTEND_URL: (process.env.FRONTEND_URL || 'http://localhost:5173').trim(),
  DATABASE_URL: (process.env.DATABASE_URL || '').trim(),
  MONGODB_URI: (process.env.MONGODB_URI || '').trim(),
  JWT_SECRET: (process.env.JWT_SECRET || 'dev-only-insecure-secret-change-me').trim(),
};

export default env;
