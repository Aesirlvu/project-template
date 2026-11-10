"use client"

import { AppShell } from "@/components/shell/app-shell"

import { ShellContent } from "../_components/shell-content"
import { shellSections } from "../_components/shell-navigation"

export default function ShellsDesktopPage() {
  return (
    <AppShell
      sections={shellSections}
      activeHref="/shells/desktop"
      title="Desktop shell"
    >
      <ShellContent
        title="Desktop shell"
        description="A persistent sidebar, a top bar and a scrollable content area. The sidebar collapses to icons below the md breakpoint."
      />
    </AppShell>
  )
}
