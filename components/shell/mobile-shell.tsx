"use client"

import { compose } from "@/lib/utils"

import { MobileNav } from "./mobile-nav"
import type { NavSection } from "./types"

const ShellRoot = compose.div<{ className?: string }>(() => [
  "flex h-dvh w-full flex-col overflow-hidden bg-background text-foreground",
])

const ShellHeader = compose.header(() => [
  "flex h-14 shrink-0 items-center gap-2 border-b bg-background px-2 pt-[env(safe-area-inset-top,0px)]",
])

const ShellTitle = compose.h1(() => [
  "min-w-0 flex-1 truncate text-sm font-semibold",
])

const ShellMain = compose.main(() => [
  "min-h-0 flex-1 overflow-y-auto overscroll-contain pb-[env(safe-area-inset-bottom,0px)]",
])

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
    <ShellRoot className={className}>
      <ShellHeader>
        <MobileNav sections={sections} activeHref={activeHref} title={title} />
        <ShellTitle>{title}</ShellTitle>
        {actions ? (
          <div className="flex items-center gap-2">{actions}</div>
        ) : null}
      </ShellHeader>
      <ShellMain>{children}</ShellMain>
    </ShellRoot>
  )
}
