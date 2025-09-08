'use client';

import { useCart } from '@/context/CartContext';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { formatPrice } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { createOrder } from '@/services/order-service';

// Datalayer is a global object, so we declare it here to avoid TypeScript errors.
declare global {
  interface Window {
    dataLayer: any[];
  }
}

const checkoutSchema = z.object({
  name: z.string().min(2, 'Nama harus terdiri dari minimal 2 karakter'),
  email: z.string().email('Silakan masukkan alamat email yang valid'),
  address: z.string().min(10, 'Alamat harus terdiri dari minimal 10 karakter'),
  city: z.string().min(2, 'Kota harus terdiri dari minimal 2 karakter'),
  zip: z.string().regex(/^\d{5}$/, 'Silakan masukkan kode pos 5 digit yang valid'),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, isLoading: isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { name: '', email: '', address: '', city: '', zip: '' },
  });
  
  const isLoading = isUserLoading;

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace('/login?redirect=/checkout');
      return;
    }
    
    if (cartItems.length === 0) {
      router.replace('/cart');
      return;
    }
    
    form.setValue('name', user.name || '');
    form.setValue('email', user.email);

    const checkoutProducts = cartItems.map(item => ({
        item_id: item.product.id.toString(),
        item_name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
    }));
    
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
      event: 'begin_checkout',
      ecommerce: {
        currency: 'IDR',
        value: cartTotal,
        items: checkoutProducts,
      },
    });

  }, [cartItems, cartTotal, router, user, form, isLoading]);

  const onSubmit = async (data: CheckoutFormValues) => {
    if (!user) {
        toast({ variant: 'destructive', title: 'Error', description: 'Anda harus login untuk checkout.' });
        return;
    }
    setIsProcessing(true);

    const transactionId = await createOrder(user, cartItems, cartTotal, data);

    if (transactionId) {
        // Store cart data for confirmation page analytics
        sessionStorage.setItem('simuweb_last_order_items', JSON.stringify(cartItems));
        sessionStorage.setItem('simuweb_last_transaction_id', transactionId);

        clearCart();
        
        toast({
            title: 'Pembelian Berhasil!',
            description: 'Mengarahkan ke halaman konfirmasi...',
        });
        
        router.push(`/confirmation?total=${cartTotal}`);
    } else {
        toast({
            variant: 'destructive',
            title: 'Gagal Memproses Pesanan',
            description: 'Terjadi kesalahan saat menyimpan pesanan Anda. Silakan coba lagi.',
        });
    }
    setIsProcessing(false);
  };
  
  if (isLoading) {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Skeleton className="h-12 w-1/3 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-1/2" />
                        <Skeleton className="h-4 w-3/4" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                           <Skeleton className="h-4 w-1/4" />
                           <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                           <Skeleton className="h-4 w-1/4" />
                           <Skeleton className="h-10 w-full" />
                        </div>
                         <div className="space-y-2">
                           <Skeleton className="h-4 w-1/4" />
                           <Skeleton className="h-10 w-full" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-1/2" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                        <hr />
                        <Skeleton className="h-8 w-full" />
                    </CardContent>
                    <CardFooter>
                        <Skeleton className="h-12 w-full" />
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
  }

  // This check is to prevent a flash of content before redirect happens
  if (!user || cartItems.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="font-headline text-4xl font-bold mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Informasi Pengiriman</CardTitle>
              <CardDescription>Masukkan detail Anda untuk menyelesaikan pembelian.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form id="checkout-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Lengkap</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alamat Email</FormLabel>
                        <FormControl>
                          <Input placeholder="anda@contoh.com" {...field} disabled />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alamat Jalan</FormLabel>
                        <FormControl>
                          <Input placeholder="Jl. Jend. Sudirman No. 123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kota</FormLabel>
                          <FormControl>
                            <Input placeholder="Jakarta" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="zip"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kode Pos</FormLabel>
                          <FormControl>
                            <Input placeholder="12345" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Ringkasan Pesanan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {cartItems.map(item => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span>{item.product.name} x {item.quantity}</span>
                  <span>{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              ))}
              <hr className="my-2" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" form="checkout-form" size="lg" className="w-full" disabled={isProcessing}>
                {isProcessing ? 'Memproses...' : 'Beli'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
