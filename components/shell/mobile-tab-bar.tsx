import { compose } from "@/lib/utils"

import type { NavItem } from "./types"

const TabBarRoot = compose.nav<{ className?: string }>(() => [
  "flex shrink-0 items-stretch border-t bg-background pb-[env(safe-area-inset-bottom,0px)]",
])

const TabLink = compose.a<{
  $active: boolean
  $disabled: boolean
}>((conditional) => [
  "flex min-h-11 flex-1 cursor-pointer touch-manipulation flex-col items-center justify-center gap-0.5 px-1 py-1.5 text-xs transition-colors",
  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
  conditional(["font-medium text-primary"], ({ $active }) => $active === true),
  conditional(
    ["text-muted-foreground hover:text-foreground"],
    ({ $active }) => $active !== true
  ),
  conditional(
    ["pointer-events-none opacity-50"],
    ({ $disabled }) => $disabled === true
  ),
])

export function MobileTabBar({
  items,
  activeHref,
  className,
}: {
  items: NavItem[]
  activeHref?: string
  className?: string
}) {
  return (
    <TabBarRoot aria-label="Primary" className={className}>
      {items.map((item) => {
        const Icon = item.icon
        const active = item.href === activeHref

        return (
          <TabLink
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            $active={active}
            $disabled={item.disabled === true}
          >
            {Icon ? <Icon className="size-5" aria-hidden="true" /> : null}
            <span className="max-w-full truncate">{item.title}</span>
          </TabLink>
        )
      })}
    </TabBarRoot>
  )
}
