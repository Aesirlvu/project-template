import type { Metadata } from "next"

import { ShowcaseNav } from "./_components/showcase-nav"

export const metadata: Metadata = {
  title: "Showcase",
  description: "Live sampling of every component shipped by the registry",
}

export default function ShowcaseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-svh flex-col lg:flex-row">
      <aside className="shrink-0 border-b bg-sidebar text-sidebar-foreground lg:sticky lg:top-0 lg:h-svh lg:w-64 lg:overflow-y-auto lg:border-r lg:border-b-0">
        <div className="flex h-14 items-center border-b px-4">
          <span className="text-sm font-semibold">Showcase</span>
        </div>
        <div className="p-3">
          <ShowcaseNav />
        </div>
      </aside>
      <main className="min-w-0 flex-1 px-6 py-10">{children}</main>
    </div>
  )
}
