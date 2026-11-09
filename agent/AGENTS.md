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

Run `npm run lint`, `npm run typecheck` and `npm run build` before declaring work complete.

## Layout

The app shell primitives live in `components/shell/`. Desktop chrome is `AppShell`; mobile chrome is `MobileShell` with `MobileNav` and `MobileTabBar`.
