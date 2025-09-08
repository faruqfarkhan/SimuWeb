-- Skema ini mendefinisikan tabel untuk aplikasi e-commerce simulasi.
-- Dibuat untuk database yang kompatibel dengan SQLite seperti Turso.

-- Tabel untuk menyimpan informasi produk.
-- Data untuk tabel ini di-seed dari `src/lib/products.ts` melalui `src/services/product-service.ts`.
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT,
    longDescription TEXT,
    image TEXT,
    dataAiHint TEXT
);

-- Tabel untuk menyimpan informasi pengguna.
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel untuk menyimpan item di keranjang belanja pengguna.
CREATE TABLE IF NOT EXISTS cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE(user_id, product_id) -- Setiap produk hanya boleh muncul sekali per pengguna di keranjang.
);

-- Tabel untuk menyimpan item di daftar keinginan (wishlist) pengguna.
CREATE TABLE IF NOT EXISTS wishlist_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE(user_id, product_id) -- Setiap produk hanya boleh muncul sekali per pengguna di wishlist.
);

-- Tabel untuk menyimpan informasi pesanan.
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    transaction_id TEXT NOT NULL UNIQUE, -- ID unik yang dibuat aplikasi untuk pelacakan
    user_id INTEGER NOT NULL,
    total_amount REAL NOT NULL,
    shipping_name TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    shipping_city TEXT NOT NULL,
    shipping_zip TEXT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL -- Simpan data pesanan meskipun pengguna dihapus
);

-- Tabel untuk menyimpan item individual dalam setiap pesanan.
CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price_per_unit REAL NOT NULL, -- Harga pada saat pembelian
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL -- Simpan item meskipun produk dihapus dari toko
);
