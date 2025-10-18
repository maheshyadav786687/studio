'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Package,
  HardHat,
  Receipt,
  CircleDollarSign,
  BarChart3,
  Settings,
  KeyRound,
  User,
  Building2,
  FileText,
  ClipboardList,
  CheckCircle,
  AlertCircle,
  Camera,
  GitPullRequest,
  Truck,
  Wallet,
  CalendarCheck,
  Landmark,
  HandCoins,
  CalendarOff,
  FileSignature,
  LineChart,
  BookUser,
  FileBarChart2,
  Building,
  File,
  UserCog,
  FileCog,
  CreditCard,
  UserCircle
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { GanttChartSquare } from 'lucide-react';

import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { 
    label: 'Clients', 
    icon: Users,
    subItems: [
      { href: '#', icon: User, label: 'Clients' },
      { href: '#', icon: Building2, label: 'Sites' },
      { href: '#', icon: FileText, label: 'Quotes' },
      { href: '#', icon: ClipboardList, label: 'Work Orders' },
    ]
  },
  {
    label: 'Projects',
    icon: Briefcase,
    subItems: [
        { href: '/admin/projects', icon: Briefcase, label: 'Projects' },
        { href: '#', icon: ClipboardList, label: 'Tasks' },
        { href: '#', icon: CheckCircle, label: 'Subtasks' },
        { href: '#', icon: AlertCircle, label: 'Issues' },
        { href: '#', icon: FileText, label: 'Daily Log' },
        { href: '#', icon: Camera, label: 'Photos' },
    ]
  },
  {
    label: 'Materials',
    icon: Package,
    subItems: [
        { href: '#', icon: GitPullRequest, label: 'Requests' },
        { href: '#', icon: Truck, label: 'Suppliers' },
        { href: '#', icon: ClipboardList, label: 'Stock' },
        { href: '#', icon: Wallet, label: 'Expenses' },
    ]
  },
  {
    label: 'Workers',
    icon: HardHat,
    subItems: [
        { href: '/admin/contractors', icon: Users, label: 'Worker List' },
        { href: '#', icon: CalendarCheck, label: 'Attendance' },
        { href: '#', icon: Landmark, label: 'Salary' },
        { href: '#', icon: HandCoins, label: 'Advances' },
        { href: '#', icon: CalendarOff, label: 'Leaves' },
    ]
  },
   {
    label: 'Billing',
    icon: Receipt,
    subItems: [
        { href: '#', icon: FileSignature, label: 'Client Bills' },
        { href: '#', icon: HandCoins, label: 'Client Payments' },
        { href: '#', icon: FileText, label: 'Vendor Bills' },
        { href: '#', icon: Wallet, label: 'Vendor Payments' },
    ]
  },
   {
    label: 'Finance',
    icon: CircleDollarSign,
    subItems: [
        { href: '#', icon: Wallet, label: 'Expenses' },
        { href: '#', icon: LineChart, label: 'Costing' },
        { href: '#', icon: BookUser, label: 'Cash Flow' },
        { href: '#', icon: FileBarChart2, label: 'Summary' },
    ]
  },
  { 
    label: 'Reports',
    icon: BarChart3,
    subItems: [
        { href: '#', icon: Briefcase, label: 'Projects' },
        { href: '#', icon: HardHat, label: 'Workers' },
        { href: '#', icon: Package, label: 'Materials' },
        { href: '#', icon: Receipt, label: 'Billing' },
    ]
  },
  {
    label: 'Settings',
    icon: Settings,
    subItems: [
        { href: '#', icon: Building, label: 'Company' },
        { href: '#', icon: FileCog, label: 'GST / PDF' },
        { href: '#', icon: UserCog, label: 'Users' },
        { href: '#', icon: CreditCard, label: 'Plan' },
    ]
  },
  {
    label: 'Account',
    icon: KeyRound,
    subItems: [
        { href: '/login', icon: KeyRound, label: 'Login' },
        { href: '#', icon: UserCircle, label: 'Profile' },
    ]
  }
];


type NavItem = {
  href?: string;
  label: string;
  icon: React.ElementType;
  subItems?: NavItem[];
};

type NavLinkProps = {
  item: NavItem;
  pathname: string;
  isSubItem?: boolean;
};

const NavLink = ({ item, pathname, isSubItem = false }: NavLinkProps) => {
  const { href, icon: Icon, label, subItems } = item;
  const isParentActive = subItems?.some(sub => sub.href && pathname.startsWith(sub.href)) || 
                         subItems?.some(sub => sub.subItems?.some(s => s.href && pathname.startsWith(s.href)));


  if (subItems) {
    const content = (
      <nav className="grid items-start px-2 text-sm font-medium lg:px-4 py-2 gap-1">
          {subItems.map((subItem) => (
              <NavLink key={subItem.label} item={subItem} pathname={pathname} isSubItem={true} />
          ))}
      </nav>
    );

    if (isSubItem) {
        return (
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value={label} className="border-b-0">
                    <AccordionTrigger className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:no-underline',
                        isParentActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : '',
                        'w-full justify-between'
                    )}>
                        <div className="flex items-center gap-3">
                           {Icon && <Icon className="h-4 w-4" />}
                           <span>{label}</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-4 pb-0">
                        {content}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        );
    }

    return (
        <AccordionItem value={label} className="border-b-0">
            <AccordionTrigger className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:no-underline',
                isParentActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''
            )}>
                 <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    <span className="flex-1 text-left">{label}</span>
                 </div>
            </AccordionTrigger>
            <AccordionContent className="pl-4 pb-0">
                {content}
            </AccordionContent>
        </AccordionItem>
    );
  }

  return (
    <Link
      href={href || '#'}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        pathname === href ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''
      )}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {label}
    </Link>
  );
};


export function AppSidebarNav() {
  const pathname = usePathname();
  const activeParent = navItems.find(item => item.subItems?.some(sub => sub.href && pathname.startsWith(sub.href)) || item.subItems?.some(sub => sub.subItems?.some(s => s.href && pathname.startsWith(s.href))));

  return (
    <div className="flex h-full max-h-screen flex-col gap-2 bg-sidebar text-sidebar-foreground">
      <div className="flex h-14 items-center border-b border-sidebar-border px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-headline font-bold text-primary">
          <GanttChartSquare className="h-6 w-6" />
          <span className="text-lg">ContractorBabu</span>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto">
        <Accordion type="single" collapsible className="w-full px-2 lg:px-4 py-2 space-y-1" defaultValue={activeParent?.label}>
           {navItems.map((item) => {
              if (item.subItems) {
                return <NavLink key={item.label} item={item as NavItem} pathname={pathname} />;
              }
              return (
                 <div key={item.label} className="px-3">
                    <Link
                        href={item.href || '#'}
                        className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                            pathname === item.href ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''
                        )}
                        >
                        {item.icon && <item.icon className="h-4 w-4" />}
                        {item.label}
                    </Link>
                 </div>
              )
           })}
        </Accordion>
      </div>
    </div>
  );
}
