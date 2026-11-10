"use client"

import { AppShell } from "@/components/shell/app-shell"
import { MobileTabBar } from "@/components/shell/mobile-tab-bar"

import { ShellContent } from "../_components/shell-content"
import { shellSections, shellTabItems } from "../_components/shell-navigation"

export default function ShellsSplitPage() {
  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-background text-foreground">
      <AppShell
        sections={shellSections}
        activeHref="/shells/split"
        title="Split shell"
        className="min-h-0 flex-1"
      >
        <ShellContent
          title="Split shell"
          description="A persistent sidebar for the wide navigation and a bottom tab bar for the primary destinations. On narrow viewports the sidebar drops and the tab bar remains."
        />
      </AppShell>
      <MobileTabBar items={shellTabItems} activeHref="/shells/split" />
    </div>
  )
}
