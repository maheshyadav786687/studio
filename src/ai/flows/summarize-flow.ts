'use server';
/**
 * @fileOverview A flow for summarizing project updates.
 * - summarizeUpdate - A function that takes a project update text and returns a summary.
 * - SummarizeUpdateInput - The input type for the summarizeUpdate function.
 * - SummarizeUpdateOutput - The return type for the summarizeUpdate function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const SummarizeUpdateInputSchema = z.object({
  updateText: z.string().min(10).describe('The detailed project update text to be summarized.'),
});
export type SummarizeUpdateInput = z.infer<typeof SummarizeUpdateInputSchema>;

export const SummarizeUpdateOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the project update.'),
});
export type SummarizeUpdateOutput = z.infer<typeof SummarizeUpdateOutputSchema>;


const summarizePrompt = ai.definePrompt({
    name: 'summarizePrompt',
    input: { schema: SummarizeUpdateInputSchema },
    output: { schema: SummarizeUpdateOutputSchema },
    prompt: `You are an expert project manager. Summarize the following project update into one or two concise sentences. Focus on progress made, blockers identified, and next steps.
    
    Update: {{{updateText}}}
    `,
});


const summarizeFlow = ai.defineFlow(
  {
    name: 'summarizeFlow',
    inputSchema: SummarizeUpdateInputSchema,
    outputSchema: SummarizeUpdateOutputSchema,
  },
  async (input) => {
    const { output } = await summarizePrompt(input);
    return output!;
  }
);

export async function summarizeUpdate(input: SummarizeUpdateInput): Promise<SummarizeUpdateOutput> {
    return await summarizeFlow(input);
}
