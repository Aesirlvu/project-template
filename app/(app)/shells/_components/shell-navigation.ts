import {
  IconChartBar,
  IconHome,
  IconInbox,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import type { NavItem, NavSection } from "@/components/shell/types"

export const shellSections: NavSection[] = [
  {
    title: "Overview",
    items: [
      { title: "Home", href: "/shells/desktop", icon: IconHome },
      { title: "Inbox", href: "/shells/mobile", icon: IconInbox },
    ],
  },
  {
    title: "Workspace",
    items: [
      { title: "Analytics", href: "/shells/split", icon: IconChartBar },
      { title: "Team", href: "/shells/mobile-drawer", icon: IconUsers },
    ],
  },
  {
    title: "System",
    items: [
      { title: "Settings", href: "/shells", icon: IconSettings },
      { title: "Legacy", href: "/shells", icon: IconUsers, disabled: true },
    ],
  },
]

export const shellTabItems: NavItem[] = [
  { title: "Home", href: "/shells/mobile", icon: IconHome },
  { title: "Inbox", href: "/shells/mobile", icon: IconInbox },
  { title: "Team", href: "/shells/mobile", icon: IconUsers },
  { title: "Settings", href: "/shells/mobile", icon: IconSettings },
]
