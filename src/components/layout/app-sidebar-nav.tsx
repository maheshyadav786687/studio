'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Briefcase,
  GanttChartSquare,
  LayoutDashboard,
  Users,
  BarChart3,
  Building2,
  FileText,
  CheckCircle,
  ClipboardList,
  AlertCircle,
  HardHat,
  CalendarCheck,
  Wallet,
  Landmark,
  User,
  GitPullRequest,
  ChevronDown,
  Settings,
  ShieldCheck,
  Package,
  Truck,
  Building,
  FileSignature,
  HandCoins,
  Receipt,
  BookUser,
  LineChart,
  CircleDollarSign,
  FileBarChart2,
  File,
  KeyRound
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { 
    label: 'Clients, Sites & Quotations', 
    icon: Building,
    subItems: [
      { href: '#', icon: User, label: 'Clients' },
      { href: '#', icon: Building2, label: 'Sites' },
      { 
        label: 'Quotations', 
        icon: FileText,
        subItems: [
          { href: '#', label: 'Create / Send / Approve' },
          { href: '#', label: 'Convert to Project' },
        ]
      },
    ]
  },
  {
    label: 'Projects & Tasks',
    icon: Briefcase,
    subItems: [
        { href: '/admin/projects', icon: Briefcase, label: 'Projects' },
        { href: '#', icon: ClipboardList, label: 'Tasks' },
        { href: '#', icon: CheckCircle, label: 'Subtasks' },
        { href: '#', icon: FileText, label: 'Daily Updates' },
        { href: '#', icon: File, label: 'Attachments' },
        { href: '#', icon: AlertCircle, label: 'Issues' },
    ]
  },
  {
    label: 'Workforce & Labor',
    icon: Users,
    subItems: [
        { href: '#', icon: HardHat, label: 'Workers' },
        { href: '/admin/contractors', icon: Users, label: 'Subcontractors' },
        { href: '#', icon: CalendarCheck, label: 'Attendance' },
        { 
            label: 'Payroll & Salary', 
            icon: Landmark,
            subItems: [
                { href: '#', label: 'Salary Structure' },
                { href: '#', label: 'Advance Salary' },
                { href: '#', label: 'Leave & Loss of Pay' },
                { href: '#', label: 'Salary Payment' },
            ]
        },
    ]
  },
   {
    label: 'Materials, Suppliers & Logistics',
    icon: Package,
    subItems: [
        { href: '#', icon: Users, label: 'Suppliers / Vendors' },
        { href: '#', icon: GitPullRequest, label: 'Material Requests' },
        { href: '#', icon: ClipboardList, label: 'Inventory' },
        { href: '#', icon: Truck, label: 'Logistics / Transportation' },
    ]
  },
   {
    label: 'Billing & Client Payments',
    icon: Receipt,
    subItems: [
        { href: '#', icon: FileSignature, label: 'Create Invoice / Bill' },
        { href: '#', icon: HandCoins, label: 'Client Advance Payment' },
        { href: '#', icon: LineChart, label: 'Payment Tracking' },
        { href: '#', icon: BookUser, label: 'Client Ledger' },
        { href: '#', icon: FileBarChart2, label: 'Billing Reports' },
    ]
  },
   {
    label: 'Financials & Budget',
    icon: CircleDollarSign,
    subItems: [
        { href: '#', icon: Wallet, label: 'Expenses' },
        { href: '#', icon: LineChart, label: 'Cost Tracking' },
        { href: '#', icon: BarChart3, label: 'Profit & Loss Summary' },
    ]
  },
  { href: '#', icon: BarChart3, label: 'Reports & Analytics' },
  {
    label: 'Master / System Configuration',
    icon: Settings,
    subItems: [
        { href: '#', icon: Settings, label: 'Company Settings' },
        { href: '#', icon: Users, label: 'User & Role Management' },
        { href: '#', icon: FileText, label: 'Subscription / Plans' },
        { href: '#', icon: File, label: 'PDF Templates' },
        { href: '#', icon: HardHat, label: 'Equipment / Asset Management' },
    ]
  },
    { href: '#', icon: KeyRound, label: 'Authentication & Security' },
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
