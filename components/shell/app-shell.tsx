import { compose } from "@/lib/utils"

import { AppSidebar } from "./app-sidebar"
import { AppTopbar } from "./app-topbar"
import type { NavSection } from "./types"

const ShellRoot = compose.div<{ className?: string }>(() => [
  "flex h-dvh w-full overflow-hidden bg-background text-foreground",
])

const ShellColumn = compose.div(() => ["flex min-w-0 flex-1 flex-col"])

const ShellMain = compose.main(() => ["flex-1 overflow-y-auto"])

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
    <ShellRoot className={className}>
      <AppSidebar
        sections={sections}
        activeHref={activeHref}
        footer={sidebarFooter}
        className="h-dvh overflow-hidden"
      />
      <ShellColumn>
        <AppTopbar title={title} actions={actions} />
        <ShellMain>{children}</ShellMain>
      </ShellColumn>
    </ShellRoot>
  )
}
