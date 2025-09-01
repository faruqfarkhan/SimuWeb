'use client';

import React, { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/utils';

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
    if (totalString) {
      const total = parseFloat(totalString);
      const newOrderId = `SW-${Math.floor(Math.random() * 100000000)}`;

      setOrderTotal(total);
      setOrderId(newOrderId);

      // Datalayer logic for analytics
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'purchase',
        ecommerce: {
          purchase: {
            actionField: {
              id: newOrderId,
              revenue: total,
            },
            products: [], // In a real app, you'd populate this with cart items.
          },
        },
      });

    } else {
      // If there's no total, the user probably didn't come from checkout.
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
