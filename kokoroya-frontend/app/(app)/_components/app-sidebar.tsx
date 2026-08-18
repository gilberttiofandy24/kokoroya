"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  HandCoins,
  UtensilsCrossed,
  Users,
  LogIn,
  LogOut,
  CalendarDays,
  Store,
  ArrowLeftRight,
  ReceiptText,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { switchBranchAction } from "@/lib/actions/branch";
import { logoutAction } from "@/lib/actions/auth";
import Image from "next/image";

const NAV_ITEMS = [
  {
    page: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  { page: "labour", label: "Labour", href: "/labour", icon: HandCoins },
  {
    page: "food-cost",
    label: "Food Cost",
    href: "/food-cost",
    icon: UtensilsCrossed,
  },
  {
    page: "food-cost",
    label: "Purchase Report",
    href: "/food-cost/purchase-report",
    icon: ReceiptText,
  },

  {
    page: "schedule",
    label: "Schedule",
    href: "/schedule",
    icon: CalendarDays,
  },
  { page: "clock-in", label: "Clock In", href: "/clock-in", icon: LogIn },
  { page: "employee", label: "Employee", href: "/employee", icon: Users },
];

const menuButtonClass =
  "hover:bg-neutral-100 hover:text-foreground active:bg-neutral-200 active:text-foreground data-active:rounded-l-none data-active:border-l-3 data-active:border-foreground data-active:bg-neutral-200 data-active:text-foreground data-active:font-bold";

export function AppSidebar({
  role,
  permissions,
}: {
  role: string;
  permissions: string[];
}) {
  const pathname = usePathname();
  const items = NAV_ITEMS.filter(
    (item) => role === "owner" || permissions.includes(item.page),
  );

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-3 text-lg font-bold">
        <Image
          src="/logo.png"
          alt="Logo"
          width={32}
          height={32}
          unoptimized
          className="invert dark:invert-0"
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                render={<Link href={item.href} />}
                isActive={pathname === item.href}
                className={menuButtonClass}
              >
                <item.icon />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          {role === "owner" && (
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<Link href="/store" />}
                isActive={pathname === "/store"}
                className={menuButtonClass}
              >
                <Store />
                <span>Branches</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <form action={switchBranchAction}>
              <SidebarMenuButton type="submit" className={menuButtonClass}>
                <ArrowLeftRight />
                <span>Switch Branch</span>
              </SidebarMenuButton>
            </form>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <form action={logoutAction}>
              <SidebarMenuButton type="submit" className={menuButtonClass}>
                <LogOut />
                <span>Logout</span>
              </SidebarMenuButton>
            </form>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
