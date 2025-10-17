'use server';

/**
 * @fileOverview A flow to summarize lengthy contractor updates using GenAI.
 *
 * - summarizeContractorUpdates - A function that handles the summarization process.
 * - SummarizeContractorUpdatesInput - The input type for the summarizeContractorUpdates function.
 * - SummarizeContractorUpdatesOutput - The return type for the summarizeContractorUpdates function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeContractorUpdatesInputSchema = z.object({
  contractorUpdate: z
    .string()
    .describe('The lengthy contractor update to be summarized.'),
});
export type SummarizeContractorUpdatesInput = z.infer<typeof SummarizeContractorUpdatesInputSchema>;

const SummarizeContractorUpdatesOutputSchema = z.object({
  summary: z.string().describe('The summarized version of the contractor update.'),
});
export type SummarizeContractorUpdatesOutput = z.infer<typeof SummarizeContractorUpdatesOutputSchema>;

export async function summarizeContractorUpdates(input: SummarizeContractorUpdatesInput): Promise<SummarizeContractorUpdatesOutput> {
  return summarizeContractorUpdatesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeContractorUpdatesPrompt',
  input: {schema: SummarizeContractorUpdatesInputSchema},
  output: {schema: SummarizeContractorUpdatesOutputSchema},
  prompt: `You are an expert project manager. You will be provided with a contractor update, and you will summarize it so that a project manager can quickly understand the progress and identify any potential issues.

Contractor Update: {{{contractorUpdate}}}`,
});

const summarizeContractorUpdatesFlow = ai.defineFlow(
  {
    name: 'summarizeContractorUpdatesFlow',
    inputSchema: SummarizeContractorUpdatesInputSchema,
    outputSchema: SummarizeContractorUpdatesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
