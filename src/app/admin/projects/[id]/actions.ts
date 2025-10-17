'use server';

import { summarizeContractorUpdates } from '@/ai/flows/summarize-contractor-updates';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const summarySchema = z.object({
  updateText: z.string().min(10, 'Update must be at least 10 characters long.'),
  projectId: z.string(),
});

export async function generateSummaryAction(prevState: any, formData: FormData) {
  const validatedFields = summarySchema.safeParse({
    updateText: formData.get('updateText'),
    projectId: formData.get('projectId'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation failed.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const { summary } = await summarizeContractorUpdates({
      contractorUpdate: validatedFields.data.updateText,
    });
    
    // In a real app, you would save the new update and summary to the database here.
    // For this demo, we just return the summary.
    // We'll also revalidate the path to show the update if we were persisting it.
    revalidatePath(`/admin/projects/${validatedFields.data.projectId}`);

    return { message: 'Summary generated successfully.', summary };
  } catch (error) {
    console.error(error);
    return { message: 'Failed to generate summary.', summary: null };
  }
}
