"use client"

import { Drawer } from "@base-ui/react/drawer"
import { IconMenu2 } from "@tabler/icons-react"
import { useState } from "react"

import { compose } from "@/lib/utils"

import { SidebarNav } from "./sidebar-nav"
import type { NavSection } from "./types"

const TriggerButton = compose.button(() => [
  "inline-flex size-11 cursor-pointer touch-manipulation items-center justify-center rounded-md transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none",
])

const CloseButton = compose.button(() => [
  "inline-flex size-11 cursor-pointer touch-manipulation items-center justify-center rounded-md transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none",
])

const DrawerTitle = compose("h2", () => ["text-sm font-semibold"])

export function MobileNav({
  sections,
  activeHref,
  title,
}: {
  sections: NavSection[]
  activeHref?: string
  title?: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Trigger
        render={
          <TriggerButton type="button" aria-label="Open navigation menu">
            <IconMenu2 className="size-5" aria-hidden="true" />
          </TriggerButton>
        }
      />
      <Drawer.Portal>
        <Drawer.Backdrop className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-200 data-[closed]:opacity-0" />
        <Drawer.Popup className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col bg-sidebar text-sidebar-foreground shadow-xl transition-transform duration-200 outline-none data-[closed]:-translate-x-full">
          <div className="flex h-14 items-center justify-between border-b px-4">
            <Drawer.Title>
              <DrawerTitle>{title ?? "Navigation"}</DrawerTitle>
            </Drawer.Title>
            <Drawer.Close
              render={
                <CloseButton type="button" aria-label="Close navigation menu">
                  <span aria-hidden="true">×</span>
                </CloseButton>
              }
            />
          </div>
          <Drawer.Viewport className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3 py-4">
            <SidebarNav
              sections={sections}
              activeHref={activeHref}
              onNavigate={() => setOpen(false)}
            />
          </Drawer.Viewport>
        </Drawer.Popup>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
