import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
  title: "App",
  description: "Application workspace",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return children
}
