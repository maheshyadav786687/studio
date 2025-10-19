'use client';

import { useState, useEffect, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { format } from 'date-fns';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sparkles } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import type { Project, ProjectUpdate } from "@/lib/types";
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
    const [updates, setUpdates] = useState<ProjectUpdate[]>(project.updates || []);
    const formRef = useRef<HTMLFormElement>(null);

    const initialState = { message: '', summary: null, errors: {}, originalContent: undefined };
    const [state, formAction] = useFormState(generateSummaryAction, initialState);

    useEffect(() => {
        if (state.message === 'Summary generated successfully.' && state.summary && state.originalContent) {
            const newUpdate: ProjectUpdate = {
                Id: `update-${Date.now()}`,
                ProjectId: project.Id,
                CompanyId: project.CompanyId,
                CreatedOn: new Date().toISOString(),
                UpdateContent: state.originalContent,
                Summary: state.summary,
                CreatedBy: "Anjali Sharma", // Hardcoded for demo
            };
            setUpdates(prev => [newUpdate, ...prev]);
            formRef.current?.reset();
        }
    }, [state]);


    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg font-headline">Progress Tracking</CardTitle>
                <CardDescription>Monitor progress through contractor updates and AI summaries.</CardDescription>
            </CardHeader>
            <CardContent>
                <form ref={formRef} action={formAction} className="space-y-4">
                    <input type="hidden" name="projectId" value={project.Id} />
                    <Textarea
                        name="updateText"
                        placeholder="Provide a detailed update on your progress, challenges, and next steps..."
                        className="min-h-[120px]"
                        required
                        minLength={10}
                    />
                    <div className="flex justify-end">
                       <SubmitButton />
                    </div>
                     {state?.errors?.updateText && (
                        <Alert variant="destructive">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{state.errors.updateText[0]}</AlertDescription>
                        </Alert>
                    )}
                    {state?.message && state.message !== 'Summary generated successfully.' && !state.errors?.updateText && (
                         <Alert variant="destructive">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{state.message}</AlertDescription>
                        </Alert>
                    )}
                </form>

                <div className="mt-6 space-y-6">
                    <h3 className="text-md font-semibold text-muted-foreground">Update History</h3>
                    {updates.map(update => (
                        <div key={update.Id} className="flex items-start gap-4 border-b pb-4 last:border-b-0">
                            <Avatar className="h-9 w-9 border">
                                <AvatarFallback>{update.CreatedBy.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="grid gap-2 flex-1">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium leading-none">{update.CreatedBy}</p>
                                    <p className="text-xs text-muted-foreground">{format(new Date(update.CreatedOn), "MMM d, yyyy")}</p>
                                </div>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{update.UpdateContent}</p>
                                {update.Summary && (
                                     <Alert variant="default" className="mt-2 bg-muted/50">
                                        <Sparkles className="h-4 w-4 text-primary" />
                                        <AlertTitle className="text-sm font-semibold">AI Summary</AlertTitle>
                                        <AlertDescription className="text-xs">{update.Summary}</AlertDescription>
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
