# project-template

A Next.js + shadcn/ui template published as a [shadcn GitHub
Registry](https://ui.shadcn.com/docs/registry). It serves two purposes:

1. **A template** — clone it to start a new project from a consistent baseline.
2. **A registry** — pull individual pieces into any existing project with
   `npx shadcn@latest add`.

## Stack

- Next.js 16 with App Router and Turbopack
- React 19
- Tailwind CSS 4 with CSS variables
- shadcn/ui (Base UI style, Tabler icons, Zinc base color)
- `tailwind-compose` for variant-aware class composition, merged through `cn`
- TypeScript 5, ESLint 9, Prettier 3

## Registry items

| Item | Type | What it installs |
| --- | --- | --- |
| `base-setup` | `registry:base` | Design system base: CSS variables, theme provider, Button component, utilities, and the base dependencies |
| `ai-stack` | `registry:lib` | Optional AI SDK 7 integration through the Vercel AI Gateway: shared provider, streaming helper, and environment variables |
| `add-deps` | `registry:file` | `scripts/add-deps.mjs`, a script to add your own dependencies on top of the base setup |
| `docs-pack` | `registry:file` | `docs/architecture.md`, `docs/conventions.md`, `docs/ARCHITECTURE.md`, and `AGENTS.md` |
| `app-shell` | `registry:block` | Desktop shell: sidebar, topbar, nav primitives (requires `base-setup`) |
| `mobile-shell` | `registry:block` | Mobile-first shell: drawer menu and bottom tab bar with safe-area handling (requires `base-setup`) |
| `dashboard-layout` | `registry:page` | `app/(app)/layout.tsx` with the viewport configuration for edge-to-edge mobile rendering |
| `agent-skills` | `registry:item` | Agent skill packs under `skills/` for registry authoring and shell construction |

## Usage

### In an existing project

The project needs a `tsconfig.json` and a `components.json` with aliases for
`components`, `ui`, `lib`, and `hooks`.

```bash
# base design system + dependencies
npx shadcn@latest add Aesirlvu/project-template/base-setup

# desktop and/or mobile application chrome
npx shadcn@latest add Aesirlvu/project-template/app-shell
npx shadcn@latest add Aesirlvu/project-template/mobile-shell

# documentation and agent instructions
npx shadcn@latest add Aesirlvu/project-template/docs-pack

# route-group layout with mobile viewport settings
npx shadcn@latest add Aesirlvu/project-template/dashboard-layout

# AI integration, only when the project needs it
npx shadcn@latest add Aesirlvu/project-template/ai-stack
```

Item dependencies are merged into your `package.json`, so your existing
scripts, versions, and dependencies are preserved. Existing files are skipped
rather than overwritten; add `--overwrite` to replace them.

Set `AI_GATEWAY_API_KEY` in your environment to call hosted models. See the
[AI Gateway documentation](https://vercel.com/docs/ai-gateway) for keys and
model IDs.

### Adding your own dependencies

```bash
npx shadcn@latest add Aesirlvu/project-template/add-deps
node scripts/add-deps.mjs zustand@^5.0.15
node scripts/add-deps.mjs --dev vitest@^4.1.11
node scripts/add-deps.mjs --list
```

### Composing class variants

`@/lib/utils` exports `compose` and `classnames` from `tailwind-compose`. The
config routes every result through `cn`, so Tailwind conflicts resolve the
same way as the rest of the project.

```tsx
import { compose } from "@/lib/utils"

const Button = compose.a<{ $active: boolean }>((conditional) => [
  "inline-flex items-center rounded-md px-3 py-2 text-sm",
  conditional(["bg-primary text-primary-foreground"], ({ $active }) => $active === true),
  conditional(["bg-muted text-muted-foreground"], ({ $active }) => $active !== true),
])
```

Two rules matter:

- Conditions return a strict `boolean`. Write `active === true`, never
  `active`, because the prop may be optional.
- State props are prefixed with `$` (`$active`, `$item`). `compose` consumes
  them to evaluate the conditions and strips them from the rendered element. A
  plain prop such as `item` leaks into the DOM as `item="[object Object]"`.

### Listing the registry

```bash
npx shadcn@latest list Aesirlvu/project-template
npx shadcn@latest view Aesirlvu/project-template/base-setup
```

### As a template

```bash
git clone https://github.com/Aesirlvu/project-template.git my-project
cd my-project
npm install
npm run dev
```

## Adding an item to the registry

1. Create the source files in the repository. Registry source paths cannot
   start with a dot, so keep dotfile sources in a plain directory and map them
   to a dotfile target (`claude/CLAUDE.md` → `~/CLAUDE.md`).
2. Add an entry to `items` in `registry.json`:

```json
{
  "name": "my-item",
  "type": "registry:block",
  "title": "My item",
  "description": "What it installs.",
  "author": "Aesirlvu <https://github.com/Aesirlvu>",
  "registryDependencies": ["Aesirlvu/project-template/base-setup"],
  "files": [
    {
      "path": "components/my-item/my-item.tsx",
      "type": "registry:component",
      "target": "@components/my-item/my-item.tsx"
    }
  ]
}
```

- `registry:file` and `registry:page` items require a `target`.
- Targets accept `~/` for the project root and `@components/`, `@ui/`,
  `@lib/`, `@hooks/` placeholders resolved against the consumer's aliases.
- Reference other items with the fully qualified `owner/repo/item` form.
- Declare dependencies in `dependencies` / `devDependencies`. Never put
  `package.json` in `files[]`: that is an overwrite, not a merge.

3. Validate and publish:

```bash
npx shadcn@latest registry validate ./registry.json
git push
```

## Development

```bash
npm run dev        # start the dev server
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
npm run build      # production build
npm run format     # Prettier
```
