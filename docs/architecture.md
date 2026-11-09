# Architecture

This repository is both a runnable Next.js application and a [shadcn](https://ui.shadcn.com) GitHub registry.

## Layers

1. **`app/`** — Next.js App Router entry points. Route groups (`(app)`) organize layouts without affecting the URL.
2. **`components/ui/`** — Primitive components generated or maintained for the shadcn registry. These are the lowest-level building blocks.
3. **`components/shell/`** — Composable application chrome (sidebar, topbar, mobile navigation, tab bar). These consume `components/ui/` and are exported as registry items.
4. **`lib/`** — Framework-agnostic utilities:
   - `lib/utils.ts` — re-exports `cn` plus the merging `compose` entry point.
   - `lib/tailwind-compose.ts` — `tailwind-compose` configured with an `onDone` hook that routes results through `cn`.
   - `lib/compose-raw.ts` — `tailwind-compose` without hooks, plus `composeClasses` and `composeClassesWithState`.
   - `lib/highlighter.tsx` — syntax highlighting helper used by the code block component.
   - `lib/ai/` — the optional AI Gateway integration.
5. **`hooks/`** — React hooks shipped with the component set (`use-mobile`, `use-highlighted-code`).
6. **`skills/`** — Agent-facing instruction packs distributed through the registry as `registry:item` entries.
7. **`docs/`** — Architecture and convention notes distributed through the registry as `registry:file` entries.
8. **`scripts/`** — Operational scripts. `scripts/add-deps.mjs` installs additional dependencies on demand without replacing `package.json`.

## Registry flow

`registry.json` at the repository root is the source of truth. Every item declares:

- `name` and `type` (`registry:base`, `registry:block`, `registry:page`, `registry:file`, `registry:item`, `registry:lib`).
- `files[]` mapping source paths to consumer targets. Targets accept `~/` for the project root and `@components/`, `@ui/`, `@lib/`, `@hooks/` placeholders resolved against the **consumer's** `components.json` aliases.
- `dependencies` / `devDependencies`, which the CLI merges into the consumer's `package.json`. `package.json` itself is never shipped in `files[]` — that would offer an overwrite instead of a merge.
- `registryDependencies` for composition. Cross-repo references use the full `owner/repo/item` form.

## Dependency policy

The base layer stays minimal. Optional stacks (AI, data, auth) ship as separate items so a consumer only installs what their use case requires. Anything not in the registry can be added later with `scripts/add-deps.mjs`, which preserves the consumer's existing scripts and versions.

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
