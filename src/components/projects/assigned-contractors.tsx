import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Project } from "@/lib/types";
import { contractors } from "@/lib/data";

type AssignedContractorsProps = {
    project: Project;
};

export function AssignedContractors({ project }: AssignedContractorsProps) {
    const assigned = contractors.filter(c => project.contractorIds.includes(c.id));

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg font-headline">Assigned Contractors</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {assigned.map(c => (
                        <div key={c.id} className="flex items-center gap-4">
                            <Avatar>
                                <AvatarImage src={c.avatarUrl} alt={c.name} data-ai-hint="person portrait" />
                                <AvatarFallback>{c.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium">{c.name}</p>
                                <p className="text-sm text-muted-foreground">{c.email}</p>
                            </div>
                        </div>
                    ))}
                    {assigned.length === 0 && (
                        <p className="text-sm text-muted-foreground">No contractors assigned yet.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
