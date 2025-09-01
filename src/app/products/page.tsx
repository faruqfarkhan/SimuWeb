
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getProducts } from '@/services/product-service';
import type { Product, PageInfo } from '@/lib/types';
import { ProductCard } from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { usePagination, DOTS } from '@/hooks/use-pagination';
import { Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const PRODUCTS_PER_PAGE = 8;

function ProductsComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);

  const searchTerm = searchParams.get('q') || '';
  const sortBy = searchParams.get('sortBy') || 'name-asc';
  const currentPage = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    const { products, pageInfo } = getProducts({ 
      searchTerm, 
      sortBy, 
      page: currentPage 
    });
    setProducts(products);
    setPageInfo(pageInfo);
  }, [searchTerm, sortBy, currentPage]);

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set('q', term);
    } else {
      params.delete('q');
    }
    params.set('page', '1');
    router.push(`/products?${params.toString()}`);
  };

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sortBy', value);
    params.set('page', '1');
    router.push(`/products?${params.toString()}`);
  };

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(pageNumber));
    return `/products?${params.toString()}`;
  };

  const paginationRange = usePagination({
    currentPage: pageInfo?.currentPage || 1,
    totalCount: pageInfo?.totalProducts || 0,
    pageSize: PRODUCTS_PER_PAGE,
  });

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
            type="search"
            placeholder="Cari produk..."
            className="pl-10 w-full"
            defaultValue={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            />
        </div>
        <Select value={sortBy} onValueChange={handleSort}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Urutkan berdasarkan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name-asc">Nama (A-Z)</SelectItem>
            <SelectItem value="name-desc">Nama (Z-A)</SelectItem>
            <SelectItem value="price-asc">Harga (Terendah)</SelectItem>
            <SelectItem value="price-desc">Harga (Tertinggi)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
            <p className="text-muted-foreground">Tidak ada produk yang ditemukan.</p>
        </div>
      )}

      {pageInfo && pageInfo.totalPages > 1 && (
        <Pagination className="mt-12">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href={createPageURL(currentPage - 1)}
                aria-disabled={currentPage === 1}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
              />
            </PaginationItem>
            {paginationRange?.map((pageNumber, index) => {
              if (pageNumber === DOTS) {
                return <PaginationEllipsis key={`${pageNumber}-${index}`} />;
              }
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink href={createPageURL(pageNumber)} isActive={currentPage === pageNumber}>
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            <PaginationItem>
              <PaginationNext 
                href={createPageURL(currentPage + 1)}
                aria-disabled={currentPage === pageInfo.totalPages}
                className={currentPage === pageInfo.totalPages ? "pointer-events-none opacity-50" : undefined}
                />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
}

function ProductsSkeleton() {
    return (
        <div>
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <Skeleton className="h-10 flex-grow" />
                <Skeleton className="h-10 w-full md:w-[200px]" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="space-y-4">
                        <Skeleton className="h-48 w-full" />
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                ))}
            </div>
        </div>
    )
}

// This is the main export for the page. It's a server component.
export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="font-headline text-4xl font-bold">Produk Kami</h1>
        <p className="text-muted-foreground mt-2">Jelajahi pilihan instrumen dan perlengkapan musik kami.</p>
      </div>
      <Suspense fallback={<ProductsSkeleton />}>
        <ProductsComponent />
      </Suspense>
    </div>
  );
}
