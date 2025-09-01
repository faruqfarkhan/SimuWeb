'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { products } from '@/lib/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

// Datalayer is a global object, so we declare it here to avoid TypeScript errors.
declare global {
  interface Window {
    dataLayer: any[];
  }
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();
  const product = products.find((p) => p.id === parseInt(id as string));
  
  useEffect(() => {
    if (product) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object
      window.dataLayer.push({
        event: 'view_item',
        ecommerce: {
          currency: 'IDR',
          value: product.price,
          items: [
            {
              item_id: product.id.toString(),
              item_name: product.name,
              price: product.price,
              quantity: 1,
            },
          ],
        },
      });
    }
  }, [product]);

  if (!product) {
    return (
        <div className="container mx-auto px-4 py-8 text-center">
            <h1 className="font-headline text-3xl font-bold">Produk tidak ditemukan</h1>
            <p>Kami tidak dapat menemukan produk yang Anda cari.</p>
        </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
  };

  const isWishlisted = wishlistItems.some((item) => item.id === product.id);

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
        <Card className="overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8">
                <CardContent className="p-0">
                    <div className="relative aspect-square w-full">
                        <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        data-ai-hint={product.dataAiHint}
                        />
                         <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-4 right-4 h-10 w-10 rounded-full bg-background/70 hover:bg-background"
                            onClick={handleWishlistToggle}
                            aria-label={isWishlisted ? 'Hapus dari Wishlist' : 'Tambah ke Wishlist'}
                        >
                            <Heart className={cn("h-5 w-5", isWishlisted ? "fill-red-500 text-red-500" : "text-foreground")} />
                        </Button>
                    </div>
                </CardContent>
                <div className="p-8 flex flex-col justify-center">
                    <h1 className="font-headline text-4xl font-bold mb-2">{product.name}</h1>
                    <p className="text-muted-foreground text-lg mb-6">{product.description}</p>
                    
                    <Separator className="my-6" />

                    <p className="font-headline text-4xl font-extrabold text-primary mb-6">
                        {formatPrice(product.price)}
                    </p>

                    <p className="text-foreground/80 mb-8 flex-grow">
                        {product.longDescription}
                    </p>

                    <Button size="lg" onClick={handleAddToCart} className="w-full">
                        <ShoppingCart className="mr-2 h-5 w-5" /> Tambah ke Keranjang
                    </Button>
                </div>
            </div>
        </Card>
    </div>
  );
}
