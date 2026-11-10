"use client"

import { MobileShell } from "@/components/shell/mobile-shell"
import { MobileTabBar } from "@/components/shell/mobile-tab-bar"

import { ShellContent } from "../_components/shell-content"
import { shellSections, shellTabItems } from "../_components/shell-navigation"

export default function ShellsMobilePage() {
  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-background text-foreground">
      <MobileShell
        sections={shellSections}
        activeHref="/shells/mobile"
        title="Mobile shell"
        className="min-h-0 flex-1"
      >
        <ShellContent
          title="Mobile shell"
          description="A drawer for the full navigation plus a bottom tab bar for the four primary destinations."
        />
      </MobileShell>
      <MobileTabBar items={shellTabItems} activeHref="/shells/mobile" />
    </div>
  )
}
