"use client"

import * as React from "react"
import {
  Home,
  Building2,
  Users,
  Settings,
  LifeBuoy,
  Send,
  Command,
} from "lucide-react"

import { NavMain } from "@/components/backend-components/nav-main"
import { NavSecondary } from "@/components/backend-components/nav-secondary"
import { NavUser } from "@/components/backend-components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Admin",
    email: "admin@kre.tn",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: Home,
      isActive: true,
    },
    {
      title: "Houses",
      url: "/admin/houses",
      icon: Building2,
      items: [
        {
          title: "All Houses",
          url: "/admin/houses",
        },
        {
          title: "Verified Houses",
          url: "/admin/houses/verified",
        },
        {
          title: "Pending Review",
          url: "/admin/houses/pending",
        },
      ],
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: Users,
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/admin">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Kre.TN</span>
                  <span className="truncate text-xs">Admin Panel</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
        
 