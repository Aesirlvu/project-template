# Architecture

This repository is both a runnable Next.js application and a [shadcn](https://ui.shadcn.com) GitHub registry.

## Layers

1. **`app/`** — Next.js App Router entry points. Route groups (`(app)`) organize layouts without affecting the URL.
2. **`components/ui/`** — Primitive components generated or maintained for the shadcn registry. These are the lowest-level building blocks.
3. **`components/shell/`** — Composable application chrome (sidebar, topbar, mobile navigation, tab bar). These consume `components/ui/` and are exported as registry items.
4. **`components/ai-elements/`** — The 21 AI Elements patterns (chat, reasoning, tool, task, sources, prompt input and more) rebuilt on top of `components/ui/`. Exported as the `ai-elements` registry item.
5. **`lib/`** — Framework-agnostic utilities:
   - `lib/utils.ts` — re-exports `cn` plus the merging `compose` entry point.
   - `lib/tailwind-compose.ts` — `tailwind-compose` configured with an `onDone` hook that routes results through `cn`.
   - `lib/compose-raw.ts` — `tailwind-compose` without hooks, plus `composeClasses` and `composeClassesWithState`.
   - `lib/highlighter.tsx` — syntax highlighting helper used by the code block component.
   - `lib/ai.ts` — `getMessageText` plus a re-export of `@shadcn/helpers/ai-sdk`. Upstream keeps this private to its own app.
   - `lib/message-animations.ts` — `ANIMATIONS` and `MESSAGE_ANIMATIONS`, the motion variants used by the chat pattern.
   - `lib/ai/` — the optional AI Gateway integration.
6. **`hooks/`** — React hooks shipped with the component set (`use-mobile`, `use-highlighted-code`).
7. **`skills/`** — Agent-facing instruction packs distributed through the registry as `registry:item` entries.
8. **`docs/`** — Architecture and convention notes distributed through the registry as `registry:file` entries.
9. **`scripts/`** — Operational scripts. `scripts/add-deps.mjs` installs additional dependencies on demand without replacing `package.json`.

## Registry flow

`registry.json` at the repository root is the source of truth. Every item declares:

- `name` and `type` (`registry:base`, `registry:block`, `registry:page`, `registry:file`, `registry:item`, `registry:lib`).
- `files[]` mapping source paths to consumer targets. Targets accept `~/` for the project root and `@components/`, `@ui/`, `@lib/`, `@hooks/` placeholders resolved against the **consumer's** `components.json` aliases.
- `dependencies` / `devDependencies`, which the CLI merges into the consumer's `package.json`. `package.json` itself is never shipped in `files[]` — that would offer an overwrite instead of a merge.
- `registryDependencies` for composition. Cross-repo references use the full `owner/repo/item` form.

## Dependency policy

The base layer stays minimal. Optional stacks (AI, data, auth) ship as separate items so a consumer only installs what their use case requires. Anything not in the registry can be added later with `scripts/add-deps.mjs`, which preserves the consumer's existing scripts and versions.

## AI Elements

The `ai-elements` item installs the 21 patterns documented at
[ui.shadcn.com/docs/ai-elements](https://ui.shadcn.com/docs/ai-elements).
Upstream ships them as documentation only — they are not published registry
items — so they are implemented here against this project's own primitives.

Each pattern lives in its own file under `components/ai-elements/` and exposes
the API described in the "Migrating from AI SDK Elements" section of its
upstream page: the same export names, the same props, composed over the
shadcn/ui primitives in `components/ui/`.

Three differences from the upstream source:

- **Tabler icons instead of Lucide.** The mapping is fixed in
  `docs/ai-elements-icons.md`.
- **No `streamdown`.** `components/markdown.tsx` renders with `react-markdown`
  and `remark-gfm`, reusing this project's `CodeBlock` component and the
  `use-highlighted-code` hook.
- **Local support modules.** `lib/ai.ts` and `lib/message-animations.ts` are
  upstream-private modules that the patterns import, so they ship with the
  item.

## Class composition

Variant definitions live in two places, and the split is deliberate.

| Component group | Mechanism | Entry point |
| --- | --- | --- |
| Primitives with a public `xxxVariants` export | `class-variance-authority` | — |
| Primitives with internal variants | `tailwind-compose` | `@/lib/compose-raw` |
| Application chrome under `components/shell/` | `tailwind-compose` | `@/lib/utils` |

The primitives use the raw entry point so their rendered classes stay identical
to the official shadcn implementation. `scripts/class-parity.probe.mjs` checks
that every migrated variant declares the same class strings as the original it
replaces.

## Styling

Tailwind CSS 4 with CSS variables in `app/globals.css`. Colors, radii and fonts are exposed as theme tokens; components consume semantic tokens (`bg-background`, `text-muted-foreground`) rather than raw palette values.
