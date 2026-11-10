import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const variants = [
  {
    href: "/shells/desktop",
    label: "Desktop",
    badge: "sidebar",
    description:
      "Persistent sidebar, top bar and scrollable content. The reference application shell.",
  },
  {
    href: "/shells/mobile",
    label: "Mobile with bottom nav",
    badge: "drawer + tabs",
    description:
      "Drawer for the full navigation plus a bottom tab bar for the primary destinations.",
  },
  {
    href: "/shells/mobile-drawer",
    label: "Mobile drawer only",
    badge: "drawer",
    description:
      "Navigation behind the menu button. The content owns the full height of the viewport.",
  },
  {
    href: "/shells/split",
    label: "Split",
    badge: "sidebar + tabs",
    description:
      "Sidebar for the wide navigation and a bottom tab bar for the primary destinations.",
  },
] as const

export default function ShellsIndexPage() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-3xl flex-col gap-10 px-6 py-10">
      <header className="flex flex-col gap-3">
        <Badge variant="secondary" className="w-fit">
          registry: app-shell
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight">
          Application shells
        </h1>
        <p className="text-muted-foreground">
          Every shell owns the whole viewport, so each one gets its own route.
          Open a variant to check the navigation, the safe area insets and the
          scroll behaviour on a real device.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {variants.map((variant) => (
          <Link key={variant.href} href={variant.href} className="group">
            <Card className="h-full transition-colors group-hover:border-foreground/20">
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle>{variant.label}</CardTitle>
                  <Badge variant="outline">{variant.badge}</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {variant.description}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  )
}
