import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getProjects } from '@/lib/bll/project-bll';


async function getRecentUpdates() {
    try {
        const projects = await getProjects();
        const allUpdates = projects
            .flatMap(p => p.updates.map(u => ({ ...u, projectName: p.name })))
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
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
                <AvatarImage src={update.authorAvatar} alt={update.author} data-ai-hint="person portrait"/>
                <AvatarFallback>{update.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">
                  {update.author} <span className="text-xs text-muted-foreground">on {update.projectName}</span>
                </p>
                <p className="text-sm text-muted-foreground">{update.summary || update.content}</p>
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
