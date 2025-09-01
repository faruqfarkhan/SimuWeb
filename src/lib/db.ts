
import { createClient } from '@libsql/client';
import { config } from 'dotenv';

// Load environment variables from .env file directly here.
// This is the most reliable way to ensure they are available for the server-side DB client.
config();

const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!TURSO_DATABASE_URL) {
  console.warn('TURSO_DATABASE_URL is not defined. Database operations will fail.');
}

if (!TURSO_AUTH_TOKEN) {
  console.warn('TURSO_AUTH_TOKEN is not defined. Database operations will fail.');
}

// The client is exported, but it might be null if the env vars are not set.
// Code using this client should handle this case gracefully.
export const db =
  TURSO_DATABASE_URL && TURSO_AUTH_TOKEN
    ? createClient({
        url: TURSO_DATABASE_URL,
        authToken: TURSO_AUTH_TOKEN,
      })
    : null;
