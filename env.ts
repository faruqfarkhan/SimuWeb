import { config } from 'dotenv';

// Load environment variables from .env file
config();

export const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL;
export const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;
