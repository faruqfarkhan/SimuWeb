'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { products } from '@/lib/products';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/utils';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const product = products.find((p) => p.id === parseInt(id as string));

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
