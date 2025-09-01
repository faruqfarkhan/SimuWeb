'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Bot, Wand2, Copy } from 'lucide-react';
import { generateCampaignContentAction } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const campaignSchema = z.object({
  keywords: z.string().min(3, 'Please enter at least 3 characters.'),
});

type CampaignFormValues = z.infer<typeof campaignSchema>;

interface CampaignResult {
  campaignName: string;
  campaignDescription: string;
}

export default function CampaignAssistantPage() {
  const [result, setResult] = useState<CampaignResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: 'Content copied to clipboard.',
    });
  };

  const onSubmit = async (data: CampaignFormValues) => {
    setIsLoading(true);
    setResult(null);
    try {
      const campaignContent = await generateCampaignContentAction(data);
      setResult(campaignContent);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate content. Please try again.',
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
       <div className="flex items-center space-x-4 mb-8">
        <Bot className="h-10 w-10 text-primary" />
        <div>
            <h1 className="font-headline text-4xl font-bold">Campaign Assistant</h1>
            <p className="text-muted-foreground">Generate campaign ideas with the power of AI.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Generate Content</CardTitle>
            <CardDescription>Enter keywords to generate a campaign name and description.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="keywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Keywords</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., summer sale, acoustic guitars, new arrivals"
                          className="resize-none"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    'Generating...'
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" /> Generate
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div>
            {isLoading && (
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-3/4" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                    </CardContent>
                </Card>
            )}
            {result && (
              <div className="space-y-6">
                <Card className="relative group">
                  <CardHeader>
                    <CardTitle className="font-headline">{result.campaignName}</CardTitle>
                    <CardDescription>Generated Campaign Name</CardDescription>
                  </CardHeader>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleCopy(result.campaignName)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </Card>
                <Card className="relative group">
                  <CardHeader>
                    <CardTitle className="font-headline">Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{result.campaignDescription}</p>
                  </CardContent>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleCopy(result.campaignDescription)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </Card>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
