# Agent Instructions

This project is a Next.js App Router application using shadcn components and Tailwind CSS 4.

## Before writing code

Read the relevant guide under `node_modules/next/dist/docs/` before touching Next.js APIs. This Next.js version has breaking changes relative to older documentation.

## Stack

- Next.js 16 (App Router, Turbopack)
- React 19
- Tailwind CSS 4 with CSS variables in `app/globals.css`
- TypeScript in strict mode
- shadcn primitives in `components/ui/` (Base UI + Tabler icons)
- `cn` from `@/lib/utils` for conditional classes

## Rules

- Use `cn(...)`; do not add `clsx` or `tailwind-merge` separately.
- Consume semantic theme tokens (`bg-background`, `text-muted-foreground`) instead of raw colors.
- Use `h-dvh`, never `h-screen`.
- Interactive targets are at least 44px (`min-h-11`).
- Icon-only buttons need `aria-label`; decorative icons need `aria-hidden="true"`.
- Hide content with `display: none` or `inert`, never `opacity: 0`.
- Use ternaries for conditional rendering, not `&&`.
- Mark client components explicitly with `"use client"` and keep the boundary minimal.

## Checks

Run `npm run lint`, `npm run typecheck`, `npm run build` and `npm test` before declaring work complete.

## Layout

The app shell primitives live in `components/shell/`. Desktop chrome is `AppShell`; mobile chrome is `MobileShell` with `MobileNav` and `MobileTabBar`.

## AI Elements

The patterns in `components/ai-elements/` use Tabler icons, never Lucide. The mapping is in `docs/ai-elements-icons.md`. They hold no `cva` and no `tailwind-compose` — they compose over `components/ui/` with plain class strings. A pattern that keeps state, or that receives an icon component or a function as a prop, must be a client component.

## ui-sdk

Before using ui-sdk, follow the ui-sdk skill if it is installed and read `node_modules/@ui-sdk/react/docs/llms.txt`.

To build a new component, search `node_modules/@ui-sdk/react/docs/core.md` by heading and read `rendering.md` alongside it.

The packages are `@ui-sdk/react` and `@ui-sdk/core` (both beta). There is no root import: every component has its own entry point, for example `import { Button } from "@ui-sdk/react/button"`.

ui-sdk components are unstyled. They expose their state as data attributes (`data-pressed`, `data-open`, `data-selected`, `data-disabled`, `data-slot`), so style them with Tailwind variants on those attributes.

Its default stylesheet is imported once in `app/globals.css`, in the `components` layer, so Tailwind's base reset does not override it. Its tokens are namespaced with `--ui-*` and do not collide with this project's semantic tokens.
