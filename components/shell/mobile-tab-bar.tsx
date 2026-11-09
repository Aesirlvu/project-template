import { cn } from "@/lib/utils"

import type { NavItem } from "./types"

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
    <nav
      aria-label="Primary"
      className={cn(
        "flex shrink-0 items-stretch border-t bg-background pb-[env(safe-area-inset-bottom,0px)]",
        className
      )}
    >
      {items.map((item) => {
        const Icon = item.icon
        const active = item.href === activeHref

        return (
          <a
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-h-11 flex-1 cursor-pointer touch-manipulation flex-col items-center justify-center gap-0.5 px-1 py-1.5 text-xs transition-colors",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              active
                ? "font-medium text-primary"
                : "text-muted-foreground hover:text-foreground",
              item.disabled && "pointer-events-none opacity-50"
            )}
          >
            {Icon ? <Icon className="size-5" aria-hidden="true" /> : null}
            <span className="max-w-full truncate">{item.title}</span>
          </a>
        )
      })}
    </nav>
  )
}
