"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "cn"

export const showcaseSections = [
  { href: "/showcase", label: "Overview" },
  { href: "/showcase/actions", label: "Actions" },
  { href: "/showcase/forms", label: "Forms" },
  { href: "/showcase/navigation", label: "Navigation" },
  { href: "/showcase/overlays", label: "Overlays" },
  { href: "/showcase/data-display", label: "Data display" },
  { href: "/showcase/feedback", label: "Feedback" },
  { href: "/showcase/layout", label: "Layout" },
  { href: "/showcase/shell", label: "Shell" },
  { href: "/shells", label: "Shells" },
] as const

export function ShowcaseNav({ className }: { className?: string }) {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Showcase sections"
      className={cn("flex flex-col gap-1", className)}
    >
      {showcaseSections.map((section) => {
        const active =
          section.href === "/showcase"
            ? pathname === section.href
            : pathname.startsWith(section.href)
        return (
          <Link
            key={section.href}
            href={section.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-h-11 touch-manipulation items-center rounded-none px-3 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              active
                ? "bg-primary font-medium text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            {section.label}
          </Link>
        )
      })}
    </nav>
  )
}
