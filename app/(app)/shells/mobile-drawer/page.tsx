"use client"

import { MobileShell } from "@/components/shell/mobile-shell"

import { ShellContent } from "../_components/shell-content"
import { shellSections } from "../_components/shell-navigation"

export default function ShellsMobileDrawerPage() {
  return (
    <MobileShell
      sections={shellSections}
      activeHref="/shells/mobile-drawer"
      title="Drawer only"
    >
      <ShellContent
        title="Drawer navigation"
        description="Navigation lives entirely behind the menu button. No bottom bar, so the content owns the full height of the viewport."
      />
    </MobileShell>
  )
}
