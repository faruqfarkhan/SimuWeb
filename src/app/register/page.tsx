export const runtime = 'nodejs'; // Pastikan runtime Node.js digunakan

'use client';

import React, { Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useUser } from '@/context/UserContext';
import { UserPlus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const registerSchema = z.object({
  name: z.string().min(2, 'Nama harus terdiri dari minimal 2 karakter.'),
  email: z.string().email('Silakan masukkan alamat email yang valid.'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

function RegisterComponent() {
  const router = useRouter();
  const { register, isLoading } = useUser();
  const { toast } = useToast();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    const user = await register(data);
    if (user) {
      router.push('/');
    } else {
        toast({
            variant: "destructive",
            title: "Pendaftaran Gagal",
            description: "Email ini mungkin sudah terdaftar. Silakan coba login.",
        });
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-3xl">Buat Akun</CardTitle>
        <CardDescription>Daftar untuk mulai berbelanja.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    <Input type="email" placeholder="anda@contoh.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Memproses...' : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Daftar
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col items-center justify-center text-sm">
         <p className="text-muted-foreground">
            Sudah punya akun?{' '}
            <Button variant="link" className="p-0 h-auto" asChild>
                <Link href="/login">Login di sini</Link>
            </Button>
          </p>
      </CardFooter>
    </Card>
  );
}

function RegisterSkeleton() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <Skeleton className="h-9 w-32 mx-auto" />
        <Skeleton className="h-5 w-56 mx-auto mt-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
         <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}

export default function RegisterPage() {
  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-10rem)] px-4 py-8">
      <Suspense fallback={<RegisterSkeleton />}>
        <RegisterComponent />
      </Suspense>
    </div>
  );
}
