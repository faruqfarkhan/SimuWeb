'use server';

import {
  generateCampaignContent,
  GenerateCampaignContentInput,
  GenerateCampaignContentOutput,
} from '@/ai/flows/generate-campaign-content';

export async function generateCampaignContentAction(
  input: GenerateCampaignContentInput
): Promise<GenerateCampaignContentOutput> {
  // Here you could add extra validation, logging, or authentication/authorization checks.
  return await generateCampaignContent(input);
}
