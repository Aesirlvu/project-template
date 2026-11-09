---
name: nextjs-app-shell
description: Use when building an application shell, dashboard layout, sidebar, topbar, or mobile navigation for a Next.js App Router project — especially when the shell must work on desktop and mobile with safe-area handling and accessible controls.
---

# Building an application shell

## Structure

Split the shell into primitives so each can be composed independently:

- `types.ts` — `NavItem` and `NavSection` types.
- `nav-link.tsx` — one navigation item, handles internal and external links.
- `sidebar-nav.tsx` — sections of navigation links.
- `app-sidebar.tsx` — the desktop sidebar column.
- `app-topbar.tsx` — the desktop header row.
- `app-shell.tsx` — desktop composition.
- `mobile-nav.tsx` — mobile menu drawer.
- `mobile-tab-bar.tsx` — mobile bottom navigation.
- `mobile-shell.tsx` — mobile composition.

## Height

Use `h-dvh`, never `h-screen`. `100vh` does not account for mobile browser chrome and causes content to be clipped or scroll unexpectedly.

## Safe areas

Apply `env(safe-area-inset-*, 0px)` to the top of the header and the bottom of the tab bar and scroll container:

```tsx
<header className="pt-[env(safe-area-inset-top,0px)]">
<nav className="pb-[env(safe-area-inset-bottom,0px)]">
```

## Touch targets

Interactive elements need at least 44px of height (`min-h-11`). Add `touch-manipulation` so taps do not wait for the double-tap zoom heuristic.

## Accessibility

- Icon-only buttons require `aria-label`.
- Decorative icons get `aria-hidden="true"`.
- The active navigation item gets `aria-current="page"`.
- Content hidden outside the tab order uses `display: none` or `inert`, never `opacity: 0`.
- Navigation containers get an `aria-label`.

## Layout

Use a flex column for the shell root with `min-h-0` on the scrollable region so overflow is contained instead of growing the page. Keep the sidebar `hidden md:flex` so the mobile shell is the only layout below the breakpoint.

## Viewport

Export a `viewport` object when rendering edge-to-edge:

```tsx
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
}
```
