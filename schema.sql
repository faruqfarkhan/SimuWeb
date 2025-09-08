-- Skema untuk tabel Produk
-- Ini disertakan untuk kelengkapan, asumsikan ini sudah ada.
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT,
    longDescription TEXT,
    image TEXT,
    dataAiHint TEXT
);

-- Skema untuk tabel Pengguna
-- Ini disertakan untuk kelengkapan, asumsikan ini sudah ada.
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    name TEXT
);

-- Skema untuk tabel Item Keranjang
-- Ini disertakan untuk kelengkapan, asumsikan ini sudah ada.
CREATE TABLE IF NOT EXISTS cart_items (
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    PRIMARY KEY (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Skema untuk tabel Item Wishlist
-- Ini disertakan untuk kelengkapan, asumsikan ini sudah ada.
CREATE TABLE IF NOT EXISTS wishlist_items (
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- =================================================================
-- SKEMA BARU UNTUK ORDERS
-- =================================================================

-- Tabel Orders: Menyimpan informasi ringkasan untuk setiap pesanan.
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    transaction_id TEXT NOT NULL UNIQUE, -- ID unik yang dapat dilihat pelanggan
    user_id INTEGER NOT NULL,
    total_amount REAL NOT NULL,
    shipping_name TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    shipping_city TEXT NOT NULL,
    shipping_zip TEXT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tabel Order Items: Menyimpan setiap item baris dalam suatu pesanan.
CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price_per_unit REAL NOT NULL, -- Harga pada saat pembelian
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);
