import { products as allProducts } from '@/lib/products';
import type { Product, PageInfo } from '@/lib/types';

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

export function getProducts({
  searchTerm = '',
  sortBy = 'name-asc',
  page = 1,
}: GetProductsParams): GetProductsResult {
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
