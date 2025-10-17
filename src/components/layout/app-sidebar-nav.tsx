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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

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
        { href: '#', label: 'Tasks' },
        { href: '#', label: 'Subtasks' },
        { href: '#', label: 'Daily Updates' },
        { href: '#', label: 'Attachments' },
        { href: '#', label: 'Issues' },
    ]
  },
  {
    label: 'Workforce & Labor',
    icon: Users,
    subItems: [
        { href: '#', icon: HardHat, label: 'Workers' },
        { href: '#', icon: Users, label: 'Subcontractors' },
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
    label: 'Materials & Logistics',
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
    label: 'System Configuration',
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
};

const NavLink = ({ item, pathname }: NavLinkProps) => {
  const { href, icon: Icon, label, subItems } = item;
  const isParentActive = subItems?.some(sub => pathname.startsWith(sub.href || ''));

  if (subItems) {
    return (
      <Collapsible defaultOpen={isParentActive}>
        <CollapsibleTrigger className="w-full">
          <div
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
               isParentActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="flex-1 text-left">{label}</span>
            <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pl-4">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4 py-2 gap-1">
                {subItems.map((subItem) => (
                    <NavLink key={subItem.label} item={subItem} pathname={pathname} />
                ))}
            </nav>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <Link
      href={href || '#'}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        pathname.startsWith(href || 'non-existent') ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''
      )}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {label}
    </Link>
  );
};


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
      <div className="flex-1 overflow-y-auto">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4 py-2 gap-1">
          {navItems.map((item) => (
            <NavLink key={item.label} item={item as NavItem} pathname={pathname} />
          ))}
        </nav>
      </div>
    </div>
  );
}
