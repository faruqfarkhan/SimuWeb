
import { products as allProducts } from '@/lib/products';
import type { Product, PageInfo } from '@/lib/types';
import { db } from '@/lib/db';

const PRODUCTS_PER_PAGE = 8;

interface GetProductsParams {
  searchTerm?: string;
  sortBy?: string;
  page?: number;
}

interface GetProductsResult {
  products: Product[];
  pageInfo: PageInfo;
}

// Function to populate the products table if it's empty
export async function seedProducts() {
  if (!db) {
    console.warn("Database not configured. Skipping product seeding.");
    return;
  }
  
  try {
    // This is a more robust way to check for existence before inserting.
    // It will not fail if the table is empty and is generally safer.
    console.log("Seeding products table if necessary...");
    const statements = allProducts.map(p => ({
      sql: 'INSERT INTO products (id, name, price, description, longDescription, image, dataAiHint) VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO NOTHING',
      args: [p.id, p.name, p.price, p.description, p.longDescription, p.image, p.dataAiHint]
    }));

    const results = await db.batch(statements, 'write');
    
    // Check if any rows were affected to give a meaningful log.
    const rowsAffected = results.reduce((acc, result) => acc.rowsAffected + (result.rowsAffected || 0), { rowsAffected: 0 });
    if (rowsAffected > 0) {
      console.log(`Successfully seeded ${rowsAffected} new products.`);
    } else {
      console.log("Products table is already up to date.");
    }

  } catch (error) {
    console.error("Error seeding products:", error);
    // If the table doesn't exist, this will fail. We need to handle schema creation first.
    // For now, we assume the schema.sql has been run manually by the developer.
  }
}

// Call seed on module load. This might run multiple times during development
// due to hot-reloading, but the ON CONFLICT clause prevents duplicates.
seedProducts();


export function getProducts({
  searchTerm = '',
  sortBy = 'name-asc',
  page = 1,
}: GetProductsParams): GetProductsResult {
  
  // NOTE: For this simulation, we'll continue to filter the in-memory array.
  // In a production app, this filtering and sorting would be done with SQL queries
  // to the database for performance and scalability.
  // Example SQL would be: `SELECT * FROM products WHERE name LIKE ? ORDER BY ? LIMIT ? OFFSET ?`

  let filteredProducts = allProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [sortField, sortOrder] = sortBy.split('-');
  
  filteredProducts.sort((a, b) => {
    let compareA, compareB;

    if (sortField === 'price') {
      compareA = a.price;
      compareB = b.price;
    } else { // default to name
      compareA = a.name.toLowerCase();
      compareB = b.name.toLowerCase();
    }
    
    if (compareA < compareB) {
      return sortOrder === 'asc' ? -1 : 1;
    }
    if (compareA > compareB) {
      return sortOrder === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
  const startIndex = (page - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const productsForPage = filteredProducts.slice(startIndex, endIndex);

  return {
    products: productsForPage,
    pageInfo: {
      currentPage: page,
      totalPages,
      totalProducts,
    },
  };
}
