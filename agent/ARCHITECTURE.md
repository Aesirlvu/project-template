# Architecture

This project is a Next.js App Router application using shadcn components and Tailwind CSS 4.

## Layers

- `app/` — routes and layouts. Route groups (`(app)`) organize structure without changing URLs.
- `components/ui/` — primitive shadcn components.
- `components/shell/` — application chrome: sidebar, topbar, mobile navigation, tab bar.
- `lib/` — utilities and optional integrations (`lib/ai/`).
- `skills/` — agent instruction packs.

## Dependency policy

The base layer stays minimal. Optional stacks ship as separate registry items so consumers only install what they need. Use `scripts/add-deps.mjs` for anything else; it preserves the existing `package.json` scripts and versions.
