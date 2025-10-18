'use client';
import Link from 'next/link';
import { CircleUser, Menu, Package2, Search, ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { AppSidebarNav } from './app-sidebar-nav';

const Breadcrumb = () => {
    const pathname = usePathname();
    const segments = pathname.split('/').filter(Boolean);

    return (
        <nav aria-label="breadcrumb" className="hidden md:flex">
            <ol className="flex items-center gap-1.5">
                <li>
                    <Link href="/admin/dashboard" className="text-muted-foreground hover:text-foreground text-lg">
                        Admin
                    </Link>
                </li>
                {segments.slice(1).map((segment, index) => {
                    const href = '/admin/' + segments.slice(1, index + 2).join('/');
                    const isLast = index === segments.length - 2;
                    return (
                        <li key={segment} className="flex items-center gap-1.5">
                             <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            <Link
                                href={href}
                                className={`text-lg font-medium capitalize ${
                                    isLast ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                                }`}
                                aria-current={isLast ? 'page' : undefined}
                            >
                                {segment.replace(/-/g, ' ')}
                            </Link>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};


export function AppHeader() {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0">
          <AppSidebarNav />
        </SheetContent>
      </Sheet>

      <div className="w-full flex-1">
         {isClient && <Breadcrumb />}
      </div>
      
      <div className="flex items-center gap-4">
        <form className="hidden md:flex ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div>
        </form>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/login">Logout</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
