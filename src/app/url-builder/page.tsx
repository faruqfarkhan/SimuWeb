'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Copy, Link2, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const urlBuilderSchema = z.object({
  baseUrl: z.string().url({ message: 'Please enter a valid URL.' }),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_term: z.string().optional(),
  utm_content: z.string().optional(),
});

type UrlBuilderFormValues = z.infer<typeof urlBuilderSchema>;

const utmOptions = {
    utm_source: ['google', 'facebook', 'newsletter'],
    utm_medium: ['cpc', 'social', 'email'],
    utm_campaign: ['summer_sale', 'new_product', 'promo_launch'],
    utm_term: ['running_shoes', 'acoustic_guitar', 'free_trial'],
    utm_content: ['logolink', 'textlink', 'banner_ad']
};

const getRandomOption = (options: string[]) => options[Math.floor(Math.random() * options.length)];


export default function UrlBuilderPage() {
  const [generatedUrl, setGeneratedUrl] = useState('');
  const { toast } = useToast();

  const form = useForm<UrlBuilderFormValues>({
    resolver: zodResolver(urlBuilderSchema),
    defaultValues: {
      baseUrl: '',
      utm_source: '',
      utm_medium: '',
      utm_campaign: '',
      utm_term: '',
      utm_content: '',
    },
    mode: 'onChange',
  });

  const watchedValues = form.watch();

  useEffect(() => {
    const { baseUrl, ...params } = watchedValues;
    if (form.formState.errors.baseUrl || !baseUrl) {
      setGeneratedUrl('');
      return;
    }

    const url = new URL(baseUrl);
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, value);
      } else {
        url.searchParams.delete(key);
      }
    });

    setGeneratedUrl(url.toString());
  }, [watchedValues, form.formState.errors.baseUrl]);

  const handleCopy = () => {
    if (generatedUrl) {
      navigator.clipboard.writeText(generatedUrl);
      toast({
        title: 'Copied to Clipboard!',
        description: 'The generated URL has been copied.',
      });
    }
  };

  const generateRandomParams = () => {
    form.setValue('utm_source', getRandomOption(utmOptions.utm_source));
    form.setValue('utm_medium', getRandomOption(utmOptions.utm_medium));
    form.setValue('utm_campaign', getRandomOption(utmOptions.utm_campaign));
    form.setValue('utm_term', getRandomOption(utmOptions.utm_term));
    form.setValue('utm_content', getRandomOption(utmOptions.utm_content));
    toast({
        title: 'Random Parameters Generated!',
        description: 'UTM parameters have been filled with random values.',
    });
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center space-x-4 mb-8">
        <Link2 className="h-10 w-10 text-primary" />
        <div>
            <h1 className="font-headline text-4xl font-bold">Campaign URL Builder</h1>
            <p className="text-muted-foreground">Create custom URLs for campaign tracking.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">URL Parameters</CardTitle>
            <CardDescription>Fill in the fields to generate your tracking URL.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className="space-y-4">
                 <FormField
                  control={form.control}
                  name="baseUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Base URL *</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="button" variant="outline" onClick={generateRandomParams} className="w-full">
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Random Params
                </Button>

                <FormField
                  control={form.control}
                  name="utm_source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign Source (utm_source)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. google" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="utm_medium"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign Medium (utm_medium)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. cpc" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="utm_campaign"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign Name (utm_campaign)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. summer_sale" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="utm_term"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign Term (utm_term)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. running+shoes" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="utm_content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign Content (utm_content)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. logolink" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="sticky top-24 h-fit">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Generated URL</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative">
                        <Textarea
                            readOnly
                            value={generatedUrl}
                            placeholder="Your generated URL will appear here"
                            className="pr-10 h-32 bg-muted/50 resize-none"
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1 h-8 w-8"
                            onClick={handleCopy}
                            disabled={!generatedUrl}
                        >
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
