'use server';

import { db } from '@/lib/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

async function DbTestPage() {
  let users: any[] = [];
  let error: string | null = null;
  let connectionStatus = 'Belum diinisialisasi';

  if (!db) {
    connectionStatus = 'Koneksi GAGAL: Variabel lingkungan Turso tidak ditemukan.';
  } else {
    try {
      connectionStatus = 'Koneksi client berhasil diinisialisasi. Mencoba mengambil data...';
      const result = await db.execute('SELECT id, name, email FROM users');
      users = result.rows;
      connectionStatus = `Berhasil mengambil data. Ditemukan ${users.length} pengguna.`;
    } catch (e: any) {
      console.error('Database query failed:', e);
      error = e.message || 'Terjadi error yang tidak diketahui saat query ke database.';
      connectionStatus = 'Koneksi client berhasil, tetapi query ke database GAGAL.';
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-headline text-4xl font-bold mb-8">Tes Koneksi Database Turso</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Status Koneksi</CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`text-lg font-semibold ${!db || error ? 'text-destructive' : 'text-green-600'}`}>
            {connectionStatus}
          </p>
          {error && (
             <div className="mt-4 p-4 bg-destructive/10 border border-destructive/50 rounded-md">
                <p className="font-bold text-destructive">Detail Error:</p>
                <pre className="text-sm text-destructive whitespace-pre-wrap">{error}</pre>
             </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data dari Tabel `users`</CardTitle>
          <CardDescription>
            Berikut adalah data mentah yang berhasil diambil dari tabel `users` di database Turso Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {users.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user, index) => (
                  <TableRow key={index}>
                    <TableCell>{String(user.id)}</TableCell>
                    <TableCell>{String(user.name)}</TableCell>
                    <TableCell>{String(user.email)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground">Tidak ada data pengguna yang ditemukan atau query gagal.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default DbTestPage;