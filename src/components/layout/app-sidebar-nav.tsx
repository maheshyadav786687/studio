'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Briefcase,
  GanttChartSquare,
  LayoutDashboard,
  Users,
  BarChart3,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const navItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/projects', icon: Briefcase, label: 'Projects', badge: '3' },
  { href: '/admin/contractors', icon: Users, label: 'Contractors' },
  { href: '/admin/reports', icon: BarChart3, label: 'Reports' },
];

export function AppSidebarNav() {
  const pathname = usePathname();

  return (
    <div className="flex h-full max-h-screen flex-col gap-2 bg-sidebar text-sidebar-foreground">
      <div className="flex h-14 items-center border-b border-sidebar-border px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-headline font-bold text-primary">
          <GanttChartSquare className="h-6 w-6" />
          <span className="text-lg">ContractorBabu</span>
        </Link>
      </div>
      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4 py-2 gap-1">
          {navItems.map(({ href, icon: Icon, label, badge }) => (
            <Link
              key={label}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                pathname.startsWith(href) ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
              {badge && (
                <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  {badge}
                </Badge>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
