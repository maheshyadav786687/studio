
"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Package,
  Receipt,
  CircleDollarSign,
  BarChart3,
  Settings,
  Building2,
  FileText,
  ClipboardList,
  CheckCircle,
  AlertCircle,
  Camera,
  GitPullRequest,
  Truck,
  Wallet,
  Building,
  FileCog,
  UserCog,
  CreditCard,
  UserCircle,
  Warehouse,
  Ship,
  GanttChartSquare,
  FileSignature,
  HandCoins,
  LineChart,
  BookUser,
  FileBarChart2,
} from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { cn } from "@/lib/utils"

const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  {
    label: "Clients",
    icon: Users,
    subItems: [
      { href: "/admin/clients", icon: Users, label: "Clients" },
      { href: "/admin/sites", icon: Building2, label: "Sites" },
      { href: "/admin/quotations", icon: FileText, label: "Quotes" },
    ],
  },
  {
    label: "Projects",
    icon: Briefcase,
    subItems: [
      { href: "/admin/projects", icon: Briefcase, label: "Projects" },
      { href: "#", icon: ClipboardList, label: "Tasks" },
      { href: "#", icon: CheckCircle, label: "Subtasks" },
      { href: "#", icon: FileText, label: "Daily Logs" },
      { href: "#", icon: Camera, label: "Photos" },
      { href: "#", icon: AlertCircle, label: "Issues" },
    ],
  },
  {
    label: "Materials",
    icon: Package,
    subItems: [
      { href: "#", icon: GitPullRequest, label: "Requests" },
      { href: "#", icon: Truck, label: "Suppliers" },
      { href: "#", icon: Warehouse, label: "Stock" },
      { href: "#", icon: Ship, label: "Logistics" },
      { href: "#", icon: Wallet, label: "Expenses" },
    ],
  },
  {
    label: "Billing",
    icon: Receipt,
    subItems: [
      { href: "#", icon: FileSignature, label: "Client Bills" },
      { href: "#", icon: HandCoins, label: "Client Payments" },
      { href: "#", icon: FileText, label: "Vendor Bills" },
      { href: "#", icon: Wallet, label: "Vendor Payments" },
    ],
  },
  {
    label: "Finance",
    icon: CircleDollarSign,
    subItems: [
      { href: "#", icon: Wallet, label: "Expenses" },
      { href: "#", icon: LineChart, label: "Costing" },
      { href: "#", icon: BookUser, label: "Cash Flow" },
      { href: "#", icon: FileBarChart2, label: "Summary" },
    ],
  },
  {
    label: "Reports",
    icon: BarChart3,
    subItems: [
      { href: "#", icon: Briefcase, label: "Projects" },
      { href: "#", icon: Package, label: "Materials" },
      { href: "#", icon: Receipt, label: "Billing" },
      { href: "#", icon: CircleDollarSign, label: "Finance" },
    ],
  },
  {
    label: "Settings",
    icon: Settings,
    subItems: [
      { href: "#", icon: Building, label: "Company" },
      { href: "#", icon: FileCog, label: "GST / PDF" },
      { href: "#", icon: Users, label: "Users" },
      { href: "#", icon: UserCog, label: "Roles" },
      { href: "#", icon: CreditCard, label: "Plan" },
      { href: "#", icon: UserCircle, label: "Profile" },
    ],
  },
]

type NavItem = {
  href?: string
  label: string
  icon: React.ElementType
  subItems?: NavItem[]
}

const NavLink = ({ item, pathname }: { item: NavItem; pathname: string }) => {
    const { href, icon: Icon, label } = item;
    const isLinkActive = href && href !== '#' && pathname.startsWith(href);
  
    return (
      <Link
        href={href || "#"}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          isLinkActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
        )}
      >
        {Icon && <Icon className="h-4 w-4" />}
        {label}
      </Link>
    );
};


export function AppSidebarNav() {
  const pathname = usePathname();
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const activeParent = isClient ? navItems.find(
    item =>
      item.subItems?.some(sub => sub.href && sub.href !== '#' && pathname.startsWith(sub.href))
  ) : null;

  return (
    <div className="flex h-full max-h-screen flex-col gap-2 bg-sidebar text-sidebar-foreground">
      <div className="flex h-14 items-center border-b border-sidebar-border px-4 lg:h-[60px] lg:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-headline font-bold text-primary"
        >
          <GanttChartSquare className="h-6 w-6" />
          <span className="text-lg">ContractorBabu</span>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto">
        {isClient ? (
             <Accordion
             type="single"
             collapsible
             className="w-full px-2 lg:px-4 space-y-1 py-2"
             defaultValue={activeParent?.label}
           >
             {navItems.map(item => (
                item.subItems ? (
                   <AccordionItem key={item.label} value={item.label} className="border-b-0">
                     <AccordionTrigger
                       className={cn(
                         "flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:no-underline",
                         item.subItems?.some(sub => sub.href && sub.href !== '#' && pathname.startsWith(sub.href)) ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
                       )}
                     >
                       <div className="flex items-center gap-3">
                         <item.icon className="h-4 w-4" />
                         <span className="flex-1 text-left">{item.label}</span>
                       </div>
                     </AccordionTrigger>
                     <AccordionContent className="pl-4 pb-0">
                       <nav className="grid items-start px-2 text-sm font-medium lg:px-4 py-2 gap-1">
                         {item.subItems.map(subItem => (
                           <NavLink key={subItem.label} item={subItem} pathname={pathname} />
                         ))}
                       </nav>
                     </AccordionContent>
                   </AccordionItem>
                 ) : (
                   <div key={item.label} className="px-2 lg:px-4">
                    <NavLink item={item} pathname={pathname} />
                   </div>
                 )
             ))}
           </Accordion>
        ) : (
            <div className="w-full px-2 lg:px-4 space-y-1 py-2">
                {navItems.map(item => (
                     <div key={item.label} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground">
                         <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  )
}
