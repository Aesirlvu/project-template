import { compose } from "@/lib/utils"

import { NavLink } from "./nav-link"
import type { NavSection } from "./types"

const SidebarNavRoot = compose.nav<{ className?: string }>(() => [
  "flex flex-col gap-6",
])

export function SidebarNav({
  sections,
  activeHref,
  onNavigate,
  className,
}: {
  sections: NavSection[]
  activeHref?: string
  onNavigate?: () => void
  className?: string
}) {
  return (
    <SidebarNavRoot aria-label="Main" className={className}>
      {sections.map((section, sectionIndex) => (
        <div
          key={section.title ?? sectionIndex}
          className="flex flex-col gap-1"
        >
          {section.title ? (
            <p className="px-3 pb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {section.title}
            </p>
          ) : null}
          {section.items.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              active={item.href === activeHref}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      ))}
    </SidebarNavRoot>
  )
}
