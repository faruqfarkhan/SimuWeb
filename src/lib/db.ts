
import { createClient } from '@libsql/client';

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

export const db =
  TURSO_DATABASE_URL && TURSO_AUTH_TOKEN
    ? createClient({
        url: TURSO_DATABASE_URL,
        authToken: TURSO_AUTH_TOKEN,
      })
    : null;
