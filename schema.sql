-- Skema tabel untuk aplikasi SimuWeb menggunakan Turso/SQLite

-- Tabel untuk menyimpan informasi pengguna
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel untuk menyimpan item di keranjang belanja pengguna
-- Ini adalah tabel join antara 'users' dan 'products'
CREATE TABLE IF NOT EXISTS cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    -- Tidak ada FOREIGN KEY ke 'products' karena produk bersifat statis di dalam kode,
    -- tetapi dalam aplikasi nyata, ini akan merujuk ke tabel 'products'.
    UNIQUE (user_id, product_id) -- Memastikan setiap produk hanya muncul sekali per keranjang pengguna
);

-- Tabel untuk menyimpan item di daftar keinginan pengguna
-- Ini adalah tabel join antara 'users' dan 'products'
CREATE TABLE IF NOT EXISTS wishlist_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    UNIQUE (user_id, product_id) -- Memastikan setiap produk hanya muncul sekali per daftar keinginan pengguna
);

-- Indeks untuk meningkatkan performa query
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items (user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_user_id ON wishlist_items (user_id);
