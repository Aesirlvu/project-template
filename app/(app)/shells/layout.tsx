import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shells",
  description: "Application shell layouts in their different combinations",
}

/**
 * The shells own the whole viewport, so this layout intentionally renders no
 * chrome of its own. Each shell route provides its own navigation.
 */
export default function ShellsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
