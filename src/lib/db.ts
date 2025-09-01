
import { createClient } from '@libsql/client';

// PERHATIAN: Masukkan URL dan Token Turso Anda di sini.
// Ini tidak direkomendasikan untuk produksi, tetapi digunakan untuk debugging.
const TURSO_DATABASE_URL = "YOUR_TURSO_DATABASE_URL_HERE";
const TURSO_AUTH_TOKEN = "YOUR_TURSO_AUTH_TOKEN_HERE";

let dbClient;
let connectionError = '';

try {
  if (!TURSO_DATABASE_URL || TURSO_DATABASE_URL === "YOUR_TURSO_DATABASE_URL_HERE") {
    throw new Error("URL Database Turso belum diatur di src/lib/db.ts");
  }
  if (!TURSO_AUTH_TOKEN || TURSO_AUTH_TOKEN === "YOUR_TURSO_AUTH_TOKEN_HERE") {
    throw new Error("Token Otorisasi Turso belum diatur di src/lib/db.ts");
  }

  dbClient = createClient({
    url: TURSO_DATABASE_URL,
    authToken: TURSO_AUTH_TOKEN,
  });

} catch (e: any) {
    connectionError = e.message;
    console.error("Gagal menginisialisasi koneksi database:", connectionError);
    dbClient = null;
}

export const db = dbClient;
