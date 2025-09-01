'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-0">
        <Link href={`/products/${product.id}`} className="relative aspect-video w-full block">
            <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                data-ai-hint={product.dataAiHint}
            />
        </Link>
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
