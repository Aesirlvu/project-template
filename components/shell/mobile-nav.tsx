import { Drawer } from "@base-ui/react/drawer"
import { IconMenu2 } from "@tabler/icons-react"
import { useState } from "react"

import { SidebarNav } from "./sidebar-nav"
import type { NavSection } from "./types"

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
          <button
            type="button"
            aria-label="Open navigation menu"
            className="inline-flex size-11 cursor-pointer touch-manipulation items-center justify-center rounded-md transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none"
          >
            <IconMenu2 className="size-5" aria-hidden="true" />
          </button>
        }
      />
      <Drawer.Portal>
        <Drawer.Backdrop className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-200 data-[closed]:opacity-0" />
        <Drawer.Popup className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col bg-sidebar text-sidebar-foreground shadow-xl transition-transform duration-200 outline-none data-[closed]:-translate-x-full">
          <div className="flex h-14 items-center justify-between border-b px-4">
            <Drawer.Title className="text-sm font-semibold">
              {title ?? "Navigation"}
            </Drawer.Title>
            <Drawer.Close
              render={
                <button
                  type="button"
                  aria-label="Close navigation menu"
                  className="inline-flex size-11 cursor-pointer touch-manipulation items-center justify-center rounded-md transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none"
                >
                  <span aria-hidden="true">×</span>
                </button>
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
