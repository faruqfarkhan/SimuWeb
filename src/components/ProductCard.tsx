'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart } from 'lucide-react';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';


interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();

  const isWishlisted = wishlistItems.some((item) => item.id === product.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation when clicking heart
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 group">
      <CardHeader className="p-0 relative">
        <Link href={`/products/${product.id}`} className="relative aspect-video w-full block">
            <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                data-ai-hint={product.dataAiHint}
            />
        </Link>
         <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/60 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={handleWishlistToggle}
            aria-label={isWishlisted ? 'Hapus dari Wishlist' : 'Tambah ke Wishlist'}
          >
            <Heart className={cn("h-4 w-4", isWishlisted ? "fill-red-500 text-red-500" : "text-foreground")} />
        </Button>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <CardTitle className="font-headline text-xl mb-2">
            <Link href={`/products/${product.id}`}>{product.name}</Link>
        </CardTitle>
        <CardDescription>{product.description}</CardDescription>
        <p className="font-headline text-lg font-bold mt-4">{formatPrice(product.price)}</p>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button onClick={() => addToCart(product)} className="w-full">
          <ShoppingCart className="mr-2 h-4 w-4" /> Tambah ke Keranjang
        </Button>
      </CardFooter>
    </Card>
  );
}
