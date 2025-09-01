'use client';

import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function WishlistPage() {
  const { wishlistItems, isLoading } = useWishlist();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-12 w-1/3 mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-headline text-4xl font-bold mb-8">Daftar Keinginan Saya</h1>
      {wishlistItems.length === 0 ? (
        <Card className="text-center py-20">
            <CardHeader>
                <Heart className="mx-auto h-16 w-16 text-muted-foreground" />
                <CardTitle className="mt-4 font-headline text-2xl">Daftar Keinginan Anda kosong</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-6">Anda belum menambahkan produk apa pun ke daftar keinginan Anda.</p>
                <Button asChild>
                    <Link href="/products">Jelajahi Produk</Link>
                </Button>
            </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {wishlistItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
