import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { ShowcaseDemo } from "./_components/showcase-section"

const groups = [
  {
    href: "/showcase/actions",
    label: "Actions",
    description:
      "Button, button group, toggle, toggle group, link button, badge, marker.",
  },
  {
    href: "/showcase/forms",
    label: "Forms",
    description:
      "Input, textarea, select, native select, checkbox, radio, slider, switch, input group, field, combobox, input otp.",
  },
  {
    href: "/showcase/navigation",
    label: "Navigation",
    description:
      "Tabs, breadcrumb, pagination, navigation menu, menubar, command, dropdown menu, sidebar, shell.",
  },
  {
    href: "/showcase/overlays",
    label: "Overlays",
    description:
      "Dialog, alert dialog, sheet, drawer, popover, hover card, tooltip, context menu.",
  },
  {
    href: "/showcase/data-display",
    label: "Data display",
    description:
      "Table, card, avatar, item, bubble, message, attachment, code block, chart, carousel, calendar.",
  },
  {
    href: "/showcase/feedback",
    label: "Feedback",
    description:
      "Alert, toast, progress, spinner, skeleton, empty, questionnaire, trace, message scroller.",
  },
  {
    href: "/showcase/layout",
    label: "Layout",
    description:
      "Accordion, collapsible, resizable, scroll area, separator, resizable panels.",
  },
  {
    href: "/showcase/shell",
    label: "Shell",
    description:
      "Sidebar, menubar, message scroller, direction provider, kbd, aspect ratio.",
  },
] as const

export default function ShowcaseOverviewPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-10">
      <header className="flex flex-col gap-3">
        <Badge variant="secondary" className="w-fit">
          registry: ui-kit
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight">
          Component showcase
        </h1>
        <p className="text-muted-foreground">
          Every component shipped by the <code>ui-kit</code> registry item,
          rendered live so you can check spacing, contrast, states and motion
          before adopting it in a real screen.
        </p>
      </header>

      <ShowcaseDemo label="quick check">
        <Button>Primary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="link">Link</Button>
      </ShowcaseDemo>

      <div className="grid gap-4 sm:grid-cols-2">
        {groups.map((group) => (
          <Link key={group.href} href={group.href} className="group">
            <Card className="h-full transition-colors group-hover:border-foreground/20">
              <CardHeader>
                <CardTitle>{group.label}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {group.description}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
