
import { createClient } from '@libsql/client';

// PERHATIAN: Masukkan URL dan Token Turso Anda di sini.
// Ini tidak direkomendasikan untuk produksi, tetapi digunakan untuk debugging.
const TURSO_DATABASE_URL = "libsql://simuapp-faruq.aws-ap-northeast-1.turso.io";
const TURSO_AUTH_TOKEN = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJnaWQiOiI3NTI4YzE5MS0yNGQ4LTQxZTktOGQ2ZS1lNmNiODM2YmRmYzkiLCJpYXQiOjE3NTY3MDM3MjAsInJpZCI6ImIwZWMyNzA4LTk1ZGQtNDBlZS05NmYxLTljM2YwYTZkYjQwOCJ9.DbNWHW_Ktxwb9Sx6PIYHKw9Sjy9zNPCVm1bc5ntd3w8BnQf6sFmmFmf4PchMXo43-LzmGddNhDk_Y8yrPWTwDw";

let dbClient;
let connectionError = '';

try {
  if (!TURSO_DATABASE_URL) {
    throw new Error("URL Database Turso belum diatur di src/lib/db.ts");
  }
  if (!TURSO_AUTH_TOKEN) {
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
