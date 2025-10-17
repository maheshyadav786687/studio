'use client';

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { format } from 'date-fns';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sparkles } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import type { Project, ProjectUpdate as ProjectUpdateType } from "@/lib/types";
import { generateSummaryAction } from '@/app/admin/projects/[id]/actions';

type ProgressUpdatesProps = {
    project: Project;
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            <Sparkles className="mr-2 h-4 w-4" />
            {pending ? 'Summarizing...' : 'Summarize with AI'}
        </Button>
    );
}


export function ProgressUpdates({ project }: ProgressUpdatesProps) {
    const [updates, setUpdates] = useState<ProjectUpdateType[]>(project.updates);
    const initialState = { message: null, summary: null, errors: {} };
    const [state, formAction] = useFormState(generateSummaryAction, initialState);
    
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        
        // Optimistically add new update
        const newUpdateText = formData.get('updateText') as string;
        if(newUpdateText && newUpdateText.length > 10) {
            const newUpdate: ProjectUpdateType = {
                id: `temp-${Date.now()}`,
                date: new Date().toISOString(),
                content: newUpdateText,
                author: "Anjali Sharma", // Hardcoded for demo
                authorAvatar: "https://picsum.photos/seed/avatar1/100/100",
            };
            setUpdates(prev => [newUpdate, ...prev]);
        }
        
        // @ts-ignore
        formAction(formData);
        
        // In a real app, the revalidation would handle UI update
        // here we manually add the summary to the new update
        if(state.summary) {
            setUpdates(prev => {
                const newUpdates = [...prev];
                const optimisticUpdate = newUpdates.find(u => u.id.startsWith('temp-'));
                if(optimisticUpdate) {
                    optimisticUpdate.summary = state.summary;
                }
                return newUpdates;
            });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg font-headline">Progress Tracking</CardTitle>
                <CardDescription>Monitor progress through contractor updates.</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="space-y-4">
                    <input type="hidden" name="projectId" value={project.id} />
                    <Textarea
                        name="updateText"
                        placeholder="Provide a detailed update on your progress, challenges, and next steps..."
                        className="min-h-[120px]"
                        required
                    />
                    <div className="flex justify-end">
                       <SubmitButton />
                    </div>
                     {state?.message && !state.summary && (
                        <Alert variant="destructive">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{state.message}</AlertDescription>
                        </Alert>
                    )}
                </form>

                <div className="mt-6 space-y-6">
                    {state.summary && (
                         <Alert>
                            <Sparkles className="h-4 w-4" />
                            <AlertTitle>AI Summary Generated</AlertTitle>
                            <AlertDescription>{state.summary}</AlertDescription>
                        </Alert>
                    )}
                    <h3 className="text-md font-semibold text-muted-foreground">Update History</h3>
                    {updates.map(update => (
                        <div key={update.id} className="flex items-start gap-4 border-b pb-4 last:border-b-0">
                            <Avatar className="h-9 w-9 border">
                                <AvatarImage src={update.authorAvatar} alt={update.author} />
                                <AvatarFallback>{update.author.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="grid gap-2 flex-1">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium leading-none">{update.author}</p>
                                    <p className="text-xs text-muted-foreground">{format(new Date(update.date), "MMM d, yyyy")}</p>
                                </div>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{update.content}</p>
                                {update.summary && (
                                     <Alert variant="default" className="mt-2 bg-muted/50">
                                        <Sparkles className="h-4 w-4 text-primary" />
                                        <AlertTitle className="text-sm font-semibold">AI Summary</AlertTitle>
                                        <AlertDescription className="text-xs">{update.summary}</AlertDescription>
                                    </Alert>
                                )}
                            </div>
                        </div>
                    ))}
                    {updates.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">No updates posted for this project yet.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
