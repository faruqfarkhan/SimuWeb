
import { createClient } from '@libsql/client';

// The env variables are now loaded by next.config.js, so we can read them directly.
const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

let warningMessage = '';
if (!TURSO_DATABASE_URL) {
  warningMessage += 'TURSO_DATABASE_URL is not defined. ';
}
if (!TURSO_AUTH_TOKEN) {
  warningMessage += 'TURSO_AUTH_TOKEN is not defined. ';
}
if(warningMessage) {
    console.warn(warningMessage + 'Database operations will fail.');
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
