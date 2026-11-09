import Link from "next/link"

import { compose } from "@/lib/utils"

import type { NavItem } from "./types"

type NavLinkProps = {
  item: NavItem
  className?: string
  active?: boolean
  onNavigate?: () => void
}

// Props prefixed with `$` are consumed by tailwind-compose to evaluate the
// conditions and are stripped from the rendered element.
const NavLinkBase = compose.a<{
  $item: NavItem
  $active: boolean
}>((conditional) => [
  "flex min-h-11 items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
  "touch-manipulation focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none",
  conditional(
    ["bg-primary font-medium text-primary-foreground"],
    ({ $active }) => $active === true
  ),
  conditional(
    ["text-muted-foreground hover:bg-accent hover:text-accent-foreground"],
    ({ $active }) => $active !== true
  ),
  conditional(
    ["pointer-events-none opacity-50"],
    ({ $item }) => $item.disabled === true
  ),
])

export function NavLink({
  item,
  className,
  active = false,
  onNavigate,
}: NavLinkProps) {
  const Icon = item.icon

  const content = (
    <>
      {Icon ? <Icon className="size-4 shrink-0" aria-hidden="true" /> : null}
      <span className="truncate">{item.title}</span>
    </>
  )

  if (item.external) {
    return (
      <NavLinkBase
        as="a"
        href={item.href}
        target="_blank"
        rel="noreferrer noopener"
        className={className}
        $item={item}
        $active={active}
        onClick={onNavigate}
      >
        {content}
      </NavLinkBase>
    )
  }

  return (
    <NavLinkBase
      as={Link}
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={className}
      $item={item}
      $active={active}
      onClick={onNavigate}
    >
      {content}
    </NavLinkBase>
  )
}
