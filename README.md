# project-template

A Next.js + shadcn/ui template published as a [shadcn GitHub
Registry](https://ui.shadcn.com/docs/registry). Use it as the common starting
point for new projects, or as a source of components, styles, and dependency
stacks.

## Stack

- Next.js 16 with App Router and Turbopack
- React 19
- Tailwind CSS 4 with CSS variables
- shadcn/ui (Base UI style, Tabler icons, Zinc base color)
- TypeScript 5, ESLint 9, Prettier 3

## Registry items

| Item | Type | What it installs |
| --- | --- | --- |
| `base-setup` | `registry:base` | Design system base: CSS variables, theme provider, Button component, utilities, and the base dependencies |
| `ai-stack` | `registry:lib` | Optional AI SDK 7 integration through the Vercel AI Gateway: shared provider, streaming helper, and environment variables |
| `add-deps` | `registry:file` | `scripts/add-deps.mjs`, a script to add your own dependencies on top of the base setup |

## Usage

Add the base setup to an existing project:

```bash
npx shadcn@latest add Aesirlvu/project-template/base-setup
```

The project needs a `tsconfig.json` and a `components.json` with aliases for
`components`, `ui`, `lib`, and `hooks`. The item's dependencies are merged into
your `package.json`, so your existing scripts, versions, and dependencies are
preserved.

Add the AI stack when the project needs AI:

```bash
npx shadcn@latest add Aesirlvu/project-template/ai-stack
```

Set `AI_GATEWAY_API_KEY` in your environment to call hosted models. See the
[AI Gateway documentation](https://vercel.com/docs/ai-gateway) for keys and
model IDs.

Add your own dependencies:

```bash
npx shadcn@latest add Aesirlvu/project-template/add-deps
node scripts/add-deps.mjs zustand@^5.0.15
node scripts/add-deps.mjs --dev vitest@^4.1.11
node scripts/add-deps.mjs --list
```

List every item in the registry:

```bash
npx shadcn@latest list Aesirlvu/project-template
```

## As a template

Clone the repository to start from the same baseline:

```bash
git clone https://github.com/Aesirlvu/project-template.git my-project
cd my-project
npm install
npm run dev
```
