'use client';

import React, { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/utils';
import type { CartItem } from '@/lib/types';

// Datalayer is a global object, so we declare it here to avoid TypeScript errors.
declare global {
  interface Window {
    dataLayer: any[];
  }
}

function ConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderTotal, setOrderTotal] = useState<number | null>(null);

  useEffect(() => {
    const totalString = searchParams.get('total');
    // Retrieve the cart items from sessionStorage
    const lastOrderItemsString = sessionStorage.getItem('simuweb_last_order_items');

    if (totalString && lastOrderItemsString) {
      const total = parseFloat(totalString);
      const lastOrderItems: CartItem[] = JSON.parse(lastOrderItemsString);
      const newOrderId = `SW-${Math.floor(Math.random() * 100000000)}`;

      setOrderTotal(total);
      setOrderId(newOrderId);

      // --- Perbaikan DataLayer ---
      // Menunda push untuk memastikan GTM sudah sepenuhnya dimuat.
      setTimeout(() => {
        window.dataLayer = window.dataLayer || [];
        
        const purchaseProducts = lastOrderItems.map(item => ({
          item_id: item.product.id.toString(),
          item_name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
        }));

        window.dataLayer.push({
          event: 'purchase',
          ecommerce: {
            transaction_id: newOrderId,
            value: total,
            currency: 'IDR',
            items: purchaseProducts,
          },
        });
      }, 500); // Penundaan 500ms sebagai fallback yang aman.


      // Clean up sessionStorage after use
      sessionStorage.removeItem('simuweb_last_order_items');

    } else {
      // If there's no total or items, the user probably didn't come from checkout.
      // Redirect them to the home page.
      router.replace('/');
    }
  }, [router, searchParams]);

  if (!orderId || orderTotal === null) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Memuat konfirmasi...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-10rem)]">
      <Card className="w-full max-w-lg text-center shadow-xl">
        <CardHeader className="items-center">
            <CheckCircle2 className="h-20 w-20 text-green-500 mb-4" />
            <CardTitle className="font-headline text-3xl">Terima Kasih Atas Pesanan Anda!</CardTitle>
            <CardDescription className="text-base">Pembelian Anda telah berhasil disimulasikan.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <Separator />
            <div className="grid grid-cols-2 gap-4 text-left">
                <div className="font-medium">ID Pesanan:</div>
                <div className="text-right font-mono">{orderId}</div>
                
                <div className="font-medium">Total Pembayaran:</div>
                <div className="text-right font-bold text-lg">{formatPrice(orderTotal)}</div>
            </div>
            <p className="text-sm text-muted-foreground">Ini adalah konfirmasi simulasi. Tidak ada pesanan nyata yang telah ditempatkan atau pembayaran yang diproses.</p>
        </CardContent>
        <CardFooter>
            <Button asChild className="w-full" size="lg">
                <Link href="/">Lanjutkan Belanja</Link>
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}


export default function ConfirmationPage() {
    return (
        // Wrap in Suspense because ConfirmationContent uses useSearchParams
        <Suspense fallback={<div>Loading...</div>}>
            <ConfirmationContent />
        </Suspense>
    )
}
