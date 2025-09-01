
import { createClient } from '@libsql/client';

// Kredensial Anda dimasukkan langsung untuk debugging.
// Ini tidak direkomendasikan untuk produksi.
const TURSO_DATABASE_URL = "libsql://simuapp-faruq.aws-ap-northeast-1.turso.io";
const TURSO_AUTH_TOKEN = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJnaWQiOiI3NTI4YzE5MS0yNGQ4LTQxZTktOGQ2ZS1lNmNiODM2YmRmYzkiLCJpYXQiOjE3NTY3MDM3MjAsInJpZCI6ImIwZWMyNzA4LTk1ZGQtNDBlZS05NmYxLTljM2YwYTZkYjQwOCJ9.DbNWHW_Ktxwb9Sx6PIYHKw9Sjy9zNPCVm1bc5ntd3w8BnQf6sFmmFmf4PchMXo43-LzmGddNhDk_Y8yrPWTwDw";


// Inisialisasi klien database. 
// Jika URL atau Token salah, ini akan menyebabkan error saat klien digunakan,
// yang mana lebih mudah untuk di-debug daripada kegagalan diam-diam.
export const db = createClient({
    url: TURSO_DATABASE_URL,
    authToken: TURSO_AUTH_TOKEN,
});
