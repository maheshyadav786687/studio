'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Briefcase,
  GanttChartSquare,
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/projects', icon: Briefcase, label: 'Projects', badge: '3' },
  { href: '/admin/contractors', icon: Users, label: 'Contractors' },
  { href: '/admin/reports', icon: BarChart3, label: 'Reports' },
];

export function AppSidebarNav() {
  const pathname = usePathname();

  return (
    <div className="flex h-full max-h-screen flex-col gap-2 bg-primary text-primary-foreground">
      <div className="flex h-14 items-center border-b border-primary-foreground/10 px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold font-headline">
          <GanttChartSquare className="h-6 w-6" />
          <span>ContractorBabu</span>
        </Link>
      </div>
      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {navItems.map(({ href, icon: Icon, label, badge }) => (
            <Link
              key={label}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-primary-foreground/10',
                pathname.startsWith(href) ? 'bg-primary-foreground/20' : ''
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
              {badge && (
                <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  {badge}
                </Badge>
              )}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4">
        <Button size="sm" className="w-full justify-start gap-3 bg-primary-foreground/10 hover:bg-primary-foreground/20">
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </div>
    </div>
  );
}
