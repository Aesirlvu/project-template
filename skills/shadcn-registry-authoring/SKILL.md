---
name: shadcn-registry-authoring
description: Use when adding or modifying items in a shadcn GitHub registry — creating registry.json entries, choosing item types, wiring file targets and aliases, composing items with registryDependencies, or debugging registry install failures.
---

# Authoring a shadcn GitHub Registry

## Item types

| Type | Use for | Requires `target` |
|---|---|---|
| `registry:base` | A complete design system: tokens, fonts, base components, config | No |
| `registry:block` | A composed feature or layout made of several components | No |
| `registry:component` | A single reusable component | No |
| `registry:ui` | A primitive UI component | No |
| `registry:lib` | A library, hook, or utility module | No |
| `registry:hook` | A React hook | No |
| `registry:theme` | Theme or token overrides | No |
| `registry:style` | A style or CSS package | No |
| `registry:font` | A font setup | No |
| `registry:page` | A route page or layout file | **Yes** |
| `registry:file` | An arbitrary project file (docs, scripts, agent instructions) | **Yes** |
| `registry:item` | A package of files with no single runtime role | No |

## Files and targets

Each entry in `files[]` needs `path` (source, relative to `registry.json`) and `target` (destination in the consumer).

Target forms:

- `~/path/to/file` — the consumer's project root.
- `@components/...`, `@ui/...`, `@lib/...`, `@hooks/...` — resolved against the **consumer's** `components.json` aliases. Placeholders are only valid at the start of a target.

Source paths must not begin with a dot. The registry cannot read dot-prefixed source paths, so map a dotfile from a non-dot source to a dotfile target:

```json
{ "path": "claude/CLAUDE.md", "target": "~/CLAUDE.md" }
```

## Dependencies

Declare dependencies in the item's `dependencies` / `devDependencies`. The CLI merges them into the consumer's `package.json` and runs the package manager install.

Never put `package.json` in `files[]`. It is treated as a file overwrite, not a merge, so the consumer's scripts and versions would be lost.

Keep optional stacks in separate items so consumers only install what they need.

## Composition

`registryDependencies` references other items. For items in the same repository, use the fully qualified form `owner/repo/item`. A bare name always resolves to the official shadcn registry.

```json
{
  "name": "app-shell",
  "type": "registry:block",
  "files": [{ "path": "components/shell/app-shell.tsx", "target": "@components/shell/app-shell.tsx" }],
  "registryDependencies": ["owner/repo/base-setup"]
}
```

Version refs are not inherited: pinning `#v1.0.0` on a parent requires pinning each dependency separately.

## Validate

```bash
npx shadcn@latest registry validate ./registry.json
npx shadcn@latest registry validate owner/repo
```

The validator checks the schema and that every referenced source file exists.

## Install behavior to remember

- The consumer needs a `tsconfig.json`; `components.json` alone is not enough.
- Existing files in the consumer are skipped, not overwritten. Use `--overwrite` to replace them.
- If the install fails, the dependency install runs first: a missing package aborts the whole operation before files are written.
