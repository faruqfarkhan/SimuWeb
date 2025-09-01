'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Image from 'next/image';

const contactSchema = z.object({
  name: z.string().min(2, 'Nama harus terdiri dari minimal 2 karakter.'),
  email: z.string().email('Silakan masukkan alamat email yang valid.'),
  message: z.string().min(10, 'Pesan harus terdiri dari minimal 10 karakter.'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const { toast } = useToast();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
        name: '',
        email: '',
        message: ''
    }
  });

  const onSubmit = (data: ContactFormValues) => {
    console.log('Contact form submitted:', data);
    toast({
      title: 'Pesan Terkirim!',
      description: 'Terima kasih telah menghubungi kami. Ini hanya simulasi.',
    });
    form.reset();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
       <div className="text-center mb-12">
        <h1 className="font-headline text-4xl font-bold">Hubungi Kami</h1>
        <p className="text-muted-foreground mt-2">Kami senang mendengar dari Anda. Hubungi kami untuk pertanyaan apa pun.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Kirim Pesan</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama</FormLabel>
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="anda@contoh.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pesan Anda</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tulis pesan Anda di sini..."
                          className="resize-none"
                          rows={6}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  <Send className="mr-2 h-4 w-4" /> Kirim Pesan
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Informasi Kontak</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                     <div className="flex items-center gap-4">
                        <MapPin className="h-5 w-5 text-primary" />
                        <span>Jl. Simulasi No. 123, Jakarta, Indonesia 12345</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Phone className="h-5 w-5 text-primary" />
                        <span>(021) 555-0123 (Dummy)</span>
                    </div>
                     <div className="flex items-center gap-4">
                        <Mail className="h-5 w-5 text-primary" />
                        <span>kontak@simuweb.com</span>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-0 relative aspect-video w-full overflow-hidden rounded-lg">
                    <Image 
                        src="https://picsum.photos/600/300?random=map"
                        alt="Peta lokasi dummy"
                        fill
                        className="object-cover"
                        data-ai-hint="world map"
                    />
                     <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <p className="text-white bg-black/50 px-4 py-2 rounded-md">Placeholder Peta</p>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
