'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useUser } from '@/context/UserContext';
import { LogIn } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Silakan masukkan alamat email yang valid'),
  password: z.string().min(1, 'Password tidak boleh kosong'), // Dummy password validation
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useUser();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    // This is a simulation, so we just call the login context function
    login(data.email);
    
    // Redirect after login
    const redirectUrl = searchParams.get('redirect') || '/';
    router.push(redirectUrl);
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-10rem)] px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl">Login</CardTitle>
          <CardDescription>Masuk untuk melanjutkan ke SimuWeb</CardDescription>
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormDescription className="text-xs">
                        Ini adalah login simulasi. Password apa pun akan berfungsi.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
