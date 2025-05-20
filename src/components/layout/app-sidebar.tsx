"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LineChart, ShieldAlert, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { Logo } from "./logo";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/trends", label: "Trends", icon: LineChart },
  { href: "/remediation", label: "Remediation", icon: ShieldAlert },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { open, setOpen, isMobile } = useSidebar();

  const handleLinkClick = () => {
    if (isMobile) {
      setOpen(false);
    }
  };

  return (
    <Sidebar collapsible="icon" variant="inset" side="left">
      <SidebarHeader className="p-4">
        <Logo />
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  onClick={handleLinkClick}
                  tooltip={item.label}
                  className="justify-start"
                >
                  <a>
                    <item.icon className="shrink-0" />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarSeparator className="my-2" />
         <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Settings" className="justify-start">
                <Link href="#">
                  <Settings className="shrink-0" />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
