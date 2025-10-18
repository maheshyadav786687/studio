import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, DollarSign, Activity } from 'lucide-react';

const stats = [
    { title: "Total Projects", value: "12", icon: Briefcase, change: "+2 from last month" },
    { title: "Total Budget Spent", value: "₹8,50,000", icon: DollarSign, change: "2% increase" },
    { title: "Tasks Completed", value: "152", icon: Activity, change: "+20 this week" }
];

export function StatsCards() {
    return (
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
            {stats.map((stat, index) => (
                <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground">{stat.change}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
