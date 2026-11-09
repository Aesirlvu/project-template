import { compose } from "@/lib/utils"

import { SidebarNav } from "./sidebar-nav"
import type { NavSection } from "./types"

const SidebarRoot = compose.aside<{ className?: string }>(() => [
  "hidden w-64 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground md:flex",
])

export function AppSidebar({
  sections,
  activeHref,
  footer,
  className,
}: {
  sections: NavSection[]
  activeHref?: string
  footer?: React.ReactNode
  className?: string
}) {
  return (
    <SidebarRoot className={className}>
      <div className="flex h-14 items-center border-b px-4">
        <span className="truncate text-sm font-semibold">App</span>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <SidebarNav sections={sections} activeHref={activeHref} />
      </div>
      {footer ? <div className="border-t p-3">{footer}</div> : null}
    </SidebarRoot>
  )
}
