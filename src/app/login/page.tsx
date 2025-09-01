export const runtime = 'nodejs'; // Pastikan runtime Node.js digunakan

'use client';

import React, { Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useUser } from '@/context/UserContext';
import { LogIn } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';


const loginSchema = z.object({
  email: z.string().email('Silakan masukkan alamat email yang valid'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading } = useUser();
  const { toast } = useToast();
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    const user = await login(data.email);
    if (user) {
        const redirectUrl = searchParams.get('redirect') || '/';
        router.push(redirectUrl);
    } else {
        toast({
            variant: "destructive",
            title: "Login Gagal",
            description: "Email tidak ditemukan. Silakan coba lagi atau daftar.",
        });
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-3xl">Login</CardTitle>
        <CardDescription>Masuk ke akun Anda untuk melanjutkan</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col items-center justify-center text-sm">
         <p className="text-muted-foreground">
            Belum punya akun?{' '}
            <Button variant="link" className="p-0 h-auto" asChild>
                <Link href="/register">Daftar di sini</Link>
            </Button>
          </p>
      </CardFooter>
    </Card>
  );
}

function LoginSkeleton() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <Skeleton className="h-9 w-24 mx-auto" />
        <Skeleton className="h-5 w-48 mx-auto mt-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-10rem)] px-4 py-8">
      <Suspense fallback={<LoginSkeleton />}>
        <LoginComponent />
      </Suspense>
    </div>
  );
}
