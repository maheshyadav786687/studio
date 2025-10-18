'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { summarizeUpdate } from '@/ai/flows/summarize-flow';

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
      summary: null,
    };
  }

  try {
    // API Layer calls the BLL (summarizeUpdate)
    const { summary } = await summarizeUpdate({ updateText: validatedFields.data.updateText });
    
    // In a real app, you would save the new update and summary to the database here.
    // For this demo, we'll just revalidate the path to simulate an update.
    revalidatePath(`/admin/projects/${validatedFields.data.projectId}`);

    // The API layer returns a DTO to the UIL
    return { 
        message: 'Summary generated successfully.', 
        summary: summary,
        originalContent: validatedFields.data.updateText,
    };

  } catch (error) {
    console.error(error);
    return { 
        message: 'Failed to generate summary.', 
        summary: null,
        originalContent: validatedFields.data.updateText,
    };
  }
}
