'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function ConfirmationPage() {
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderTotal, setOrderTotal] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const total = localStorage.getItem('simuweb_order_total');
    if (total) {
      setOrderTotal(total);
      setOrderId(`SW-${Math.floor(Math.random() * 100000000)}`);
      // It's good practice to clean up localStorage after use
      localStorage.removeItem('simuweb_order_total');
    } else {
      // If there's no total, the user probably didn't come from checkout
      router.replace('/');
    }
  }, [router]);

  if (!orderId || !orderTotal) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading confirmation...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-10rem)]">
      <Card className="w-full max-w-lg text-center shadow-xl">
        <CardHeader className="items-center">
            <CheckCircle2 className="h-20 w-20 text-green-500 mb-4" />
            <CardTitle className="font-headline text-3xl">Thank You For Your Order!</CardTitle>
            <CardDescription className="text-base">Your purchase has been successfully simulated.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <Separator />
            <div className="grid grid-cols-2 gap-4 text-left">
                <div className="font-medium">Order ID:</div>
                <div className="text-right font-mono">{orderId}</div>
                
                <div className="font-medium">Total Payment:</div>
                <div className="text-right font-bold text-lg">${orderTotal}</div>
            </div>
            <p className="text-sm text-muted-foreground">This is a simulated confirmation. No real order has been placed or payment processed.</p>
        </CardContent>
        <CardFooter>
            <Button asChild className="w-full" size="lg">
                <Link href="/">Continue Shopping</Link>
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
