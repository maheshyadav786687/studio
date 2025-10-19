import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getProjects } from '@/lib/bll/project-bll';
import { ProjectUpdate } from '@/lib/types';

async function getRecentUpdates() {
    try {
        const projects = await getProjects();
        const allUpdates = projects
            .flatMap(p => (p.updates || []).map((u: ProjectUpdate) => ({ ...u, projectName: p.Name })))
            .sort((a, b) => new Date(b.CreatedOn).getTime() - new Date(a.CreatedOn).getTime())
            .slice(0, 5);
        return allUpdates;
    } catch (error) {
        console.error("Failed to fetch recent updates", error);
        return [];
    }
}


export async function RecentUpdates() {
  const allUpdates = await getRecentUpdates();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Recent Project Updates</CardTitle>
        <CardDescription>Latest updates from ongoing projects.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {allUpdates.map((update, index) => (
            <div key={index} className="flex items-start gap-4">
              <Avatar className="h-9 w-9">
                <AvatarFallback>{update.CreatedBy.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">
                  {update.CreatedBy} <span className="text-xs text-muted-foreground">on {update.projectName}</span>
                </p>
                <p className="text-sm text-muted-foreground">{update.Summary || update.UpdateContent}</p>
              </div>
            </div>
          ))}
           {allUpdates.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No recent updates.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
