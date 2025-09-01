import { createClient } from '@libsql/client';
import { TURSO_AUTH_TOKEN, TURSO_DATABASE_URL } from '../../env';

if (!TURSO_DATABASE_URL) {
  // In a real app, you'd want to throw an error here or have a fallback.
  // For this simulation, we'll allow it to run without a DB for guest users,
  // but operations requiring the DB will fail.
  console.warn('TURSO_DATABASE_URL is not defined');
}

if (!TURSO_AUTH_TOKEN) {
  console.warn('TURSO_AUTH_TOKEN is not defined');
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
