
import { db } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// We will attempt to connect and query the database right in the server component.
async function getDbStatus() {
  if (!db) {
    return {
      status: 'Koneksi GAGAL',
      error: 'Klien database tidak terinisialisasi. Periksa src/lib/db.ts',
      data: null,
    };
  }

  try {
    // This query is simple and should always run if the connection is valid.
    const result = await db.execute('SELECT * FROM users');
    return {
      status: 'Koneksi & Query Berhasil!',
      error: null,
      data: result.rows,
    };
  } catch (e: any) {
    // If the query fails, it's likely a connection or authentication issue.
    return {
      status: 'Query GAGAL',
      error: e.message,
      data: null,
    };
  }
}

export default async function DbTestPage() {
  const { status, error, data } = await getDbStatus();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-headline text-4xl font-bold mb-8">Halaman Tes Database</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Status Koneksi</CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`text-2xl font-bold ${status.includes('Berhasil') ? 'text-green-500' : 'text-red-500'}`}>
            {status}
          </p>
          {error && (
            <p className="text-destructive mt-2 font-mono bg-destructive/10 p-4 rounded-md">{error}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data dari Tabel `users`</CardTitle>
        </CardHeader>
        <CardContent>
            <p className='text-muted-foreground mb-4'>Berikut adalah data mentah yang berhasil diambil dari tabel `users` di database Turso Anda.</p>
          {data && data.length > 0 ? (
            <pre className="bg-muted p-4 rounded-md overflow-x-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          ) : (
            <p className="text-muted-foreground">Tidak ada data pengguna yang ditemukan atau query gagal.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
