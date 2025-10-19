import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { Project, Task } from "@/lib/types";

type TaskListProps = {
    project: Project;
};

export function TaskList({ project }: TaskListProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg font-headline">Task Management</CardTitle>
                <CardDescription>Track the completion of work.</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    {(project.tasks || []).map((task: Task) => (
                        <AccordionItem key={task.Id} value={task.Id}>
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    id={`task-${task.Id}`}
                                    checked={task.StatusId === '2'}
                                    aria-label={`Mark ${task.Description} as complete`}
                                />
                                <AccordionTrigger className="flex-1 py-3 text-left">
                                    <label htmlFor={`task-${task.Id}`} className="font-medium cursor-pointer">
                                        {task.Description}
                                    </label>
                                </AccordionTrigger>
                            </div>
                            <AccordionContent className="pl-10">
                                <p className="text-muted-foreground">{task.Description}</p>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                    {(project.tasks || []).length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">No tasks for this project.</p>
                    )}
                </Accordion>
            </CardContent>
        </Card>
    );
}
