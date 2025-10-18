'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

type ChartData = {
  name: string;
  total: number;
};

type ProjectsOverviewChartProps = {
  data: ChartData[];
};

export function ProjectsOverviewChart({ data }: ProjectsOverviewChartProps) {
  return (
    <Card className="lg:col-span-2">
        <CardHeader>
            <CardTitle className='font-headline'>Projects Overview</CardTitle>
            <CardDescription>A summary of current project statuses.</CardDescription>
        </CardHeader>
      <CardContent>
        {data.length > 0 ? (
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
                allowDecimals={false}
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
        ) : (
          <div className="flex h-[350px] w-full items-center justify-center">
            <p className="text-muted-foreground">Could not load chart data.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
