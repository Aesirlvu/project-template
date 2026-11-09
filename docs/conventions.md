# Conventions

## Components

- Use `cn(...)` from `@/lib/utils` for conditional class names. Do not introduce `clsx` or `tailwind-merge` separately.
- Use `cva` for variants; keep variant definitions next to the component.
- Prefer the shadcn primitives in `components/ui/` over raw HTML for interactive elements.
- Use `import type` for type-only imports.

## Styling

- Tailwind CSS 4. No config file; theme tokens live in `app/globals.css`.
- Consume semantic tokens (`bg-card`, `text-muted-foreground`, `border-border`). Avoid hard-coded palette values.
- Use `h-dvh`, never `h-screen`, so mobile browser chrome does not clip content.
- Respect safe areas with `env(safe-area-inset-*, 0px)`.

## Interaction

- Interactive targets are at least 44px tall (`min-h-11`).
- Icon-only buttons require an `aria-label`. Decorative icons get `aria-hidden="true"`.
- Add `touch-manipulation` to controls that respond to taps.
- Hide content with `display: none` or `inert`, never `opacity: 0`, so it leaves the tab order.
- Use ternaries for conditional rendering in React, not `&&`.

## Routing

- Use route groups (`app/(app)/`) to share layouts without changing URLs.
- Export a `viewport` object with `viewportFit: "cover"` when the app renders edge-to-edge on mobile.

## TypeScript

- Strict mode is enabled. No `any`; prefer `unknown` plus narrowing.
- Keep server and client boundaries explicit: add `"use client"` only where interactivity requires it.

## Registry contributions

- Source paths must not start with a dot. Map a dotfile via a non-dot source and a dotfile target.
- `registry:file` and `registry:page` items require a `target`.
- Reference registry items with the full `owner/repo/item` form.
- Never place `package.json` in `files[]`; declare dependencies instead.
