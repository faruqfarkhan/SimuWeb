'use client';

import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, ShoppingBag } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-headline text-4xl font-bold mb-8">Keranjang Belanja</h1>
      {cartItems.length === 0 ? (
        <Card className="text-center py-20">
            <CardHeader>
                <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground" />
                <CardTitle className="mt-4 font-headline text-2xl">Keranjang Anda kosong</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-6">Sepertinya Anda belum menambahkan apa pun ke keranjang.</p>
                <Button asChild>
                    <Link href="/">Mulai Belanja</Link>
                </Button>
            </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px] hidden md:table-cell">Produk</TableHead>
                            <TableHead>Detail</TableHead>
                            <TableHead className="text-center">Jumlah</TableHead>
                            <TableHead className="text-right">Harga</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {cartItems.map(item => (
                            <TableRow key={item.product.id}>
                                <TableCell className="hidden md:table-cell">
                                    <div className="relative h-20 w-20 rounded-md overflow-hidden">
                                        <Image
                                            src={item.product.image}
                                            alt={item.product.name}
                                            fill
                                            className="object-cover"
                                            data-ai-hint={item.product.dataAiHint}
                                        />
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <p className="font-medium">{item.product.name}</p>
                                    <p className="text-sm text-muted-foreground hidden sm:block">{item.product.description}</p>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Input
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value))}
                                        className="w-20 mx-auto"
                                    />

                                </TableCell>
                                <TableCell className="text-right font-medium">{formatPrice(item.product.price * item.quantity)}</TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.product.id)}>
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">Hapus item</span>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Ringkasan Pesanan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>{formatPrice(cartTotal)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Pengiriman</span>
                        <span>GRATIS</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>{formatPrice(cartTotal)}</span>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button asChild size="lg" className="w-full">
                        <Link href="/checkout">Lanjutkan ke Checkout</Link>
                    </Button>
                </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
