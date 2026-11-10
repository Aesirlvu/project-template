"use client"

import {
  IconChartBar,
  IconHome,
  IconInbox,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

const navigation = [
  {
    label: "Overview",
    items: [
      { title: "Home", icon: IconHome },
      { title: "Inbox", icon: IconInbox, badge: "12" },
    ],
  },
  {
    label: "Workspace",
    items: [
      { title: "Analytics", icon: IconChartBar },
      { title: "Team", icon: IconUsers },
    ],
  },
]

export function ShowcaseSidebar() {
  return (
    <SidebarProvider className="h-72 min-h-72 overflow-hidden rounded-none border border-border">
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1">
            <span className="flex size-7 items-center justify-center rounded-none bg-primary text-xs font-semibold text-primary-foreground">
              PT
            </span>
            <span className="truncate text-sm font-semibold group-data-[collapsible=icon]:hidden">
              Project template
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          {navigation.map((group) => (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton tooltip={item.title}>
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                      {item.badge ? (
                        <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                      ) : null}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
          <SidebarGroup>
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive tooltip="Website">
                    <IconHome />
                    <span>Website</span>
                  </SidebarMenuButton>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton isActive>
                        Marketing site
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton>Design system</SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Settings">
                <IconSettings />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <div className="flex items-center gap-2 px-2 py-2 group-data-[collapsible=icon]:hidden">
            <Avatar size="sm">
              <AvatarFallback>AL</AvatarFallback>
            </Avatar>
            <span className="truncate text-xs text-muted-foreground">
              Ada Lovelace
            </span>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="flex items-center gap-2 border-b px-4 py-3">
          <SidebarTrigger />
          <span className="text-sm font-medium">Content area</span>
        </div>
        <div className="p-4 text-sm text-muted-foreground">
          The sidebar collapses to icons on narrow viewports.
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
