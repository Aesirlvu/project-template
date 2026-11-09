import { cn } from "@/lib/utils"

import { AppSidebar } from "./app-sidebar"
import { AppTopbar } from "./app-topbar"
import type { NavSection } from "./types"

export function AppShell({
  sections,
  activeHref,
  title,
  actions,
  sidebarFooter,
  children,
  className,
}: {
  sections: NavSection[]
  activeHref?: string
  title?: string
  actions?: React.ReactNode
  sidebarFooter?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex h-dvh w-full overflow-hidden bg-background text-foreground",
        className
      )}
    >
      <AppSidebar
        sections={sections}
        activeHref={activeHref}
        footer={sidebarFooter}
        className="h-dvh overflow-hidden"
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar title={title} actions={actions} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
