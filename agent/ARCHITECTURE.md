# Architecture

This project is a Next.js App Router application using shadcn components and Tailwind CSS 4.

## Layers

- `app/` — routes and layouts. Route groups (`(app)`) organize structure without changing URLs.
- `components/ui/` — primitive shadcn components.
- `components/shell/` — application chrome: sidebar, topbar, mobile navigation, tab bar.
- `components/ai-elements/` — the AI Elements patterns (chat, reasoning, tool, task, sources, prompt input and more), composed over `components/ui/`.
- `lib/` — utilities and optional integrations (`lib/ai/`).
- `skills/` — agent instruction packs.

## AI Elements

The AI Elements patterns use Tabler icons, not Lucide. The fixed mapping lives in
`docs/ai-elements-icons.md`. Three support modules ship with them:
`lib/ai.ts` (`getMessageText`), `lib/message-animations.ts`
(`ANIMATIONS`, `MESSAGE_ANIMATIONS`) and `components/markdown.tsx`
(`Markdown`).

Base UI primitives take `render={<Button />}`, not `asChild`, and menu parts
need their group ancestor — a `DropdownMenuLabel` outside a
`DropdownMenuGroup` throws `MenuGroupContext is missing` at runtime.

## Dependency policy

The base layer stays minimal. Optional stacks ship as separate registry items so consumers only install what they need. Use `scripts/add-deps.mjs` for anything else; it preserves the existing `package.json` scripts and versions.
