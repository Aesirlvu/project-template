export type NavItem = {
  title: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  disabled?: boolean
  external?: boolean
}

export type NavSection = {
  title?: string
  items: NavItem[]
}
