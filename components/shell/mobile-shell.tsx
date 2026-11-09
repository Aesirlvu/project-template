import { cn } from "@/lib/utils"

import { MobileNav } from "./mobile-nav"
import type { NavSection } from "./types"

export function MobileShell({
  sections,
  activeHref,
  title,
  actions,
  children,
  className,
}: {
  sections: NavSection[]
  activeHref?: string
  title?: string
  actions?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex h-dvh w-full flex-col overflow-hidden bg-background text-foreground",
        className
      )}
    >
      <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-2 pt-[env(safe-area-inset-top,0px)]">
        <MobileNav sections={sections} activeHref={activeHref} title={title} />
        <h1 className="min-w-0 flex-1 truncate text-sm font-semibold">
          {title}
        </h1>
        {actions ? (
          <div className="flex items-center gap-2">{actions}</div>
        ) : null}
      </header>
      <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-[env(safe-area-inset-bottom,0px)]">
        {children}
      </main>
    </div>
  )
}
