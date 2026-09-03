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
  MONGODB_URI: (process.env.MONGODB_URI || 'mongodb+srv://keerthana230406_db_user:z5aVO7yDGAGHutzc@cluster0.mzgrlrl.mongodb.net/projectpulse?retryWrites=true&w=majority&appName=Cluster0').trim(),
  JWT_SECRET: (process.env.JWT_SECRET || 'kX9mP2vL8qR5tY3wZ7nB4jC6hF1sA0dE').trim(),
};

export default env;
