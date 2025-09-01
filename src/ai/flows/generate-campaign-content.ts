'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating creative campaign names and descriptions using GenAI.
 *
 * - generateCampaignContent - A function that takes keywords as input and returns a campaign name and description.
 * - GenerateCampaignContentInput - The input type for the generateCampaignContent function.
 * - GenerateCampaignContentOutput - The return type for the generateCampaignContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCampaignContentInputSchema = z.object({
  keywords: z
    .string()
    .describe('Keywords to use for generating campaign content.'),
});
export type GenerateCampaignContentInput = z.infer<
  typeof GenerateCampaignContentInputSchema
>;

const GenerateCampaignContentOutputSchema = z.object({
  campaignName: z.string().describe('The generated campaign name.'),
  campaignDescription: z.string().describe('The generated campaign description.'),
});
export type GenerateCampaignContentOutput = z.infer<
  typeof GenerateCampaignContentOutputSchema
>;

export async function generateCampaignContent(
  input: GenerateCampaignContentInput
): Promise<GenerateCampaignContentOutput> {
  return generateCampaignContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCampaignContentPrompt',
  input: {schema: GenerateCampaignContentInputSchema},
  output: {schema: GenerateCampaignContentOutputSchema},
  prompt: `You are a marketing expert. Generate a creative campaign name and a compelling campaign description based on the following keywords: {{{keywords}}}.`,
});

const generateCampaignContentFlow = ai.defineFlow(
  {
    name: 'generateCampaignContentFlow',
    inputSchema: GenerateCampaignContentInputSchema,
    outputSchema: GenerateCampaignContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
