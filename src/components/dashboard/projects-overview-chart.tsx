'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getProjects } from '@/lib/services/project-api-service';
import { Project } from '@/lib/types';
import { useEffect, useState } from 'react';


export function ProjectsOverviewChart() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
        const projects = await getProjects();
        const counts = {
            'In Progress': 0,
            'Completed': 0,
            'Not Started': 0,
            'Delayed': 0,
        };

        projects.forEach(project => {
            if (project.status in counts) {
                counts[project.status]++;
            }
        });
        
        setData(Object.entries(counts).map(([name, value]) => ({ name, total: value })));
    }
    fetchData();
  }, []);

  return (
    <Card className="lg:col-span-2">
        <CardHeader>
            <CardTitle className='font-headline'>Projects Overview</CardTitle>
            <CardDescription>A summary of current project statuses.</CardDescription>
        </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis
              dataKey="name"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
                contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))'
                }}
             />
            <Bar dataKey="total" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
