import Link from "next/link"

import { cn } from "@/lib/utils"

import type { NavItem } from "./types"

export function NavLink({
  item,
  className,
  active = false,
  onNavigate,
}: {
  item: NavItem
  className?: string
  active?: boolean
  onNavigate?: () => void
}) {
  const Icon = item.icon

  const content = (
    <>
      {Icon ? <Icon className="size-4 shrink-0" aria-hidden="true" /> : null}
      <span className="truncate">{item.title}</span>
    </>
  )

  const classes = cn(
    "flex min-h-11 items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
    "touch-manipulation focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none",
    active
      ? "bg-primary font-medium text-primary-foreground"
      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
    item.disabled && "pointer-events-none opacity-50",
    className
  )

  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noreferrer noopener"
        className={classes}
        onClick={onNavigate}
      >
        {content}
      </a>
    )
  }

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={classes}
      onClick={onNavigate}
    >
      {content}
    </Link>
  )
}
