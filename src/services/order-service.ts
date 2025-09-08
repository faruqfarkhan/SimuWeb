'use server';

import { db } from '@/lib/db';
import type { CartItem, User } from '@/lib/types';

interface ShippingDetails {
    name: string;
    address: string;
    city: string;
    zip: string;
}

/**
 * Membuat pesanan baru di database.
 * Ini melibatkan pembuatan entri di tabel `orders` dan beberapa entri di `order_items`.
 * Fungsi ini juga menghasilkan transaction_id yang unik.
 *
 * @param user Pengguna yang membuat pesanan.
 * @param cartItems Array item di keranjang.
 * @param cartTotal Total biaya pesanan.
 * @param shippingDetails Detail pengiriman.
 * @returns transaction_id jika berhasil, jika tidak null.
 */
export async function createOrder(
    user: User,
    cartItems: CartItem[],
    cartTotal: number,
    shippingDetails: ShippingDetails,
): Promise<string | null> {
    if (!db) {
        console.error("Database not configured. Cannot create order.");
        return null;
    }

    if (cartItems.length === 0) {
        console.error("Cannot create an order with an empty cart.");
        return null;
    }

    const transaction_id = `SW-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    try {
        // Mulai transaksi untuk memastikan semua query berhasil atau tidak sama sekali.
        // NOTE: `@libsql/client` versi ini mungkin tidak mendukung transaksi interaktif `BEGIN/COMMIT` secara langsung.
        // Sebaliknya, kita menggunakan `batch` untuk mengirim semua pernyataan sekaligus,
        // yang secara atomik dieksekusi oleh Turso.

        // 1. Buat pernyataan INSERT untuk tabel `orders`.
        // Kita tidak bisa mendapatkan `lastInsertRowid` secara langsung dari batch, jadi kita akan mengandalkan transaction_id yang unik.
        const orderInsertStmt = {
            sql: `
                INSERT INTO orders (transaction_id, user_id, total_amount, shipping_name, shipping_address, shipping_city, shipping_zip)
                VALUES (?, ?, ?, ?, ?, ?, ?);
            `,
            args: [
                transaction_id,
                user.id,
                cartTotal,
                shippingDetails.name,
                shippingDetails.address,
                shippingDetails.city,
                shippingDetails.zip
            ]
        };

        // 2. Buat pernyataan INSERT untuk setiap item di `order_items`.
        const orderItemsInsertStmts = cartItems.map(item => ({
            sql: `
                INSERT INTO order_items (order_id, product_id, quantity, price_per_unit)
                VALUES ((SELECT id FROM orders WHERE transaction_id = ?), ?, ?, ?);
            `,
            args: [
                transaction_id,
                item.product.id,
                item.quantity,
                item.product.price
            ]
        }));
        
        // Gabungkan semua pernyataan menjadi satu batch.
        const allStatements = [orderInsertStmt, ...orderItemsInsertStmts];

        // Eksekusi batch.
        await db.batch(allStatements, 'write');

        return transaction_id;
    } catch (error) {
        console.error("Failed to create order in database:", error);
        // Jika ada kesalahan, batalkan pesanan (jika memungkinkan) atau log error.
        // Dengan batching, jika salah satu gagal, semuanya akan digagalkan oleh Turso.
        return null;
    }
}
