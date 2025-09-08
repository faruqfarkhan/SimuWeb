'use client';

import React, { Suspense } from 'react';
import { useEffect, useState, useCallback } from 'react';
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
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [orderTotal, setOrderTotal] = useState<number | null>(null);

  const sendPurchaseEvent = useCallback(() => {
    // This function will be called after a short delay
    const lastOrderItemsString = sessionStorage.getItem('simuweb_last_order_items');
    const lastTransactionId = sessionStorage.getItem('simuweb_last_transaction_id');
    const totalString = searchParams.get('total');
    
    if (totalString && lastOrderItemsString && lastTransactionId) {
        const total = parseFloat(totalString);
        const lastOrderItems: CartItem[] = JSON.parse(lastOrderItemsString);
        
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ ecommerce: null }); // Clear previous ecommerce object
        
        const purchaseProducts = lastOrderItems.map(item => ({
            item_id: item.product.id.toString(),
            item_name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
        }));
        
        window.dataLayer.push({
            event: 'purchase',
            ecommerce: {
            transaction_id: lastTransactionId,
            value: total,
            currency: 'IDR',
            items: purchaseProducts,
            },
        });

        // Clean up sessionStorage after use
        sessionStorage.removeItem('simuweb_last_order_items');
        sessionStorage.removeItem('simuweb_last_transaction_id');
    }
  }, [searchParams]);

  useEffect(() => {
    const lastTransactionId = sessionStorage.getItem('simuweb_last_transaction_id');
    const totalString = searchParams.get('total');

    if (lastTransactionId && totalString) {
      setTransactionId(lastTransactionId);
      setOrderTotal(parseFloat(totalString));
      
      // Delay the dataLayer push slightly to ensure GTM has loaded on this new page.
      // This is a more robust way to handle the race condition.
      const timer = setTimeout(() => {
        sendPurchaseEvent();
      }, 500); // 500ms delay as a safe fallback

      return () => clearTimeout(timer);

    } else {
      // If there's no data, the user probably didn't come from checkout.
      // Redirect them to the home page.
      router.replace('/');
    }
  }, [router, searchParams, sendPurchaseEvent]);

  if (!transactionId || orderTotal === null) {
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
            <CardDescription className="text-base">Pembelian Anda telah berhasil direkam di database kami.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <Separator />
            <div className="grid grid-cols-2 gap-4 text-left">
                <div className="font-medium">ID Transaksi:</div>
                <div className="text-right font-mono">{transactionId}</div>
                
                <div className="font-medium">Total Pembayaran:</div>
                <div className="text-right font-bold text-lg">{formatPrice(orderTotal)}</div>
            </div>
            <p className="text-sm text-muted-foreground">Ini adalah konfirmasi simulasi. Tidak ada pembayaran nyata yang diproses.</p>
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
