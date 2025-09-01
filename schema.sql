-- Skema Database untuk Aplikasi SimuWeb dengan Turso DB

-- ======== Tabel Pengguna ========
-- Tabel ini menyimpan informasi tentang pengguna yang terdaftar.
CREATE TABLE users (
    -- Column: id
    -- Data type: INTEGER
    -- Constraints: PRIMARY KEY, AUTOINCREMENT
    -- Default: Tidak ada (dihasilkan secara otomatis)
    -- Generated: Ya, secara otomatis bertambah untuk setiap pengguna baru.
    -- Deskripsi: Kunci utama unik untuk setiap pengguna.
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    -- Column: email
    -- Data type: TEXT
    -- Constraints: NOT NULL, UNIQUE
    -- Default: Tidak ada
    -- Generated: Tidak
    -- Deskripsi: Alamat email pengguna, digunakan untuk login dan harus unik.
    email TEXT NOT NULL UNIQUE,

    -- Column: name
    -- Data type: TEXT
    -- Constraints: -
    -- Default: Tidak ada
    -- Generated: Tidak
    -- Deskripsi: Nama pengguna, bersifat opsional.
    name TEXT,

    -- Column: created_at
    -- Data type: TEXT
    -- Constraints: NOT NULL
    -- Default: CURRENT_TIMESTAMP
    -- Generated: Ya, diatur ke stempel waktu saat ini secara otomatis.
    -- Deskripsi: Stempel waktu kapan catatan pengguna dibuat. Disimpan sebagai teks dalam format ISO 8601.
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ======== Tabel Item Keranjang Belanja ========
-- Tabel ini menghubungkan pengguna dengan produk di keranjang belanja mereka.
CREATE TABLE cart_items (
    -- Column: id
    -- Data type: INTEGER
    -- Constraints: PRIMARY KEY, AUTOINCREMENT
    -- Default: Tidak ada (dihasilkan secara otomatis)
    -- Generated: Ya, secara otomatis bertambah untuk setiap item keranjang.
    -- Deskripsi: Kunci utama unik untuk setiap baris di keranjang.
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    
    -- Column: user_id
    -- Data type: INTEGER
    -- Constraints: NOT NULL, FOREIGN KEY (mereferensikan users.id)
    -- Default: Tidak ada
    -- Generated: Tidak
    -- Deskripsi: Kunci asing yang menunjuk ke pengguna yang memiliki item ini.
    user_id INTEGER NOT NULL,

    -- Column: product_id
    -- Data type: INTEGER
    -- Constraints: NOT NULL
    -- Default: Tidak ada
    -- Generated: Tidak
    -- Deskripsi: ID produk yang ditambahkan ke keranjang. ID ini berasal dari data produk statis di dalam aplikasi.
    product_id INTEGER NOT NULL,

    -- Column: quantity
    -- Data type: INTEGER
    -- Constraints: NOT NULL
    -- Default: 1
    -- Generated: Tidak
    -- Deskripsi: Jumlah unit produk tertentu di dalam keranjang.
    quantity INTEGER NOT NULL DEFAULT 1,

    -- Column: created_at
    -- Data type: TEXT
    -- Constraints: NOT NULL
    -- Default: CURRENT_TIMESTAMP
    -- Generated: Ya, diatur ke stempel waktu saat ini secara otomatis.
    -- Deskripsi: Stempel waktu kapan item ditambahkan ke keranjang.
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Constraint: Kombinasi user_id dan product_id harus unik untuk mencegah duplikasi produk yang sama untuk pengguna yang sama.
    UNIQUE(user_id, product_id),

    -- Constraint: Menetapkan hubungan kunci asing ke tabel users.
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ======== Tabel Item Daftar Keinginan ========
-- Tabel ini menghubungkan pengguna dengan produk di daftar keinginan mereka.
CREATE TABLE wishlist_items (
    -- Column: id
    -- Data type: INTEGER
    -- Constraints: PRIMARY KEY, AUTOINCREMENT
    -- Default: Tidak ada (dihasilkan secara otomatis)
    -- Generated: Ya, secara otomatis bertambah untuk setiap item daftar keinginan.
    -- Deskripsi: Kunci utama unik untuk setiap baris di daftar keinginan.
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    -- Column: user_id
    -- Data type: INTEGER
    -- Constraints: NOT NULL, FOREIGN KEY (mereferensikan users.id)
    -- Default: Tidak ada
    -- Generated: Tidak
    -- Deskripsi: Kunci asing yang menunjuk ke pengguna yang memiliki item ini.
    user_id INTEGER NOT NULL,

    -- Column: product_id
    -- Data type: INTEGER
    -- Constraints: NOT NULL
    -- Default: Tidak ada
    -- Generated: Tidak
    -- Deskripsi: ID produk yang ditambahkan ke daftar keinginan.
    product_id INTEGER NOT NULL,

    -- Column: created_at
    -- Data type: TEXT
    -- Constraints: NOT NULL
    -- Default: CURRENT_TIMESTAMP
    -- Generated: Ya, diatur ke stempel waktu saat ini secara otomatis.
    -- Deskripsi: Stempel waktu kapan item ditambahkan ke daftar keinginan.
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Constraint: Kombinasi user_id dan product_id harus unik.
    UNIQUE(user_id, product_id),

    -- Constraint: Menetapkan hubungan kunci asing ke tabel users.
    FOREIGN KEY(user_d) REFERENCES users(id) ON DELETE CASCADE
);

-- Menambahkan indeks untuk mempercepat kueri umum
CREATE INDEX idx_cart_user_id ON cart_items(user_id);
CREATE INDEX idx_wishlist_user_id ON wishlist_items(user_id);
