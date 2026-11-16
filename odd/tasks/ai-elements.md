# AI Elements — shadcn AI patterns as a registry block

Objective: port the 21 AI Elements patterns from the shadcn docs into this repo as `components/ai-elements/*`, with the canonical "Migrating from AI SDK Elements" API, Tabler icons, and a registry item consumers can install.
Branch: `feat/ai-elements`
Delivery strategy: `ask-on-risk` — forecast is well above the 400 authored-line budget, so work-unit commits per task group.
Test runner: `npm run lint`, `npm run typecheck`, `npm run build`, `npm test`.

## Specs

### S1 — Pattern components

Each of the 21 patterns lives in `components/ai-elements/<name>.tsx` and exports the API declared in the "Migrating from AI SDK Elements" section of its official doc page.

The 21 patterns: `chain-of-thought`, `chat`, `checkpoint`, `confirmation`, `context`, `file-tree`, `inline-citation`, `message`, `model-selector`, `plan`, `prompt-input`, `queue`, `reasoning`, `sources`, `stack-trace`, `subagent`, `suggestion`, `task`, `terminal`, `test-results`, `tool`.

Authoritative source for each pattern's API and implementation:
`https://ui.shadcn.com/docs/ai-elements/base/<name>.md`

### S2 — Icon library

This repo uses `@tabler/icons-react` (`components.json` → `iconLibrary: "tabler"`). The upstream docs use `lucide-react`. Every lucide icon referenced by a pattern must be replaced by its Tabler equivalent. The mapping is fixed in `docs/ai-elements-icons.md` and shared by all pattern files.

### S3 — Local support files

Three modules that upstream keeps inside its own app must exist here:

- `lib/ai.ts` — exports `getMessageText(message: Pick<UIMessage, "parts">): string` and re-exports the public chat API from `@shadcn/helpers/ai-sdk`.
- `lib/message-animations.ts` — exports `ANIMATIONS` and `MESSAGE_ANIMATIONS` (a map of animation id to `Variants`), using the `Variants` type from `motion/react`.
- `components/markdown.tsx` — exports `Markdown`, a `react-markdown` + `remark-gfm` renderer.

### S4 — Dependencies

The registry must declare the runtime dependencies the patterns need: `@ai-sdk/react`, `@shadcn/helpers`, `motion`, `react-markdown`, `remark-gfm`. `class-variance-authority` stays in the registry because 7 shadcn primitives still use it.

### S5 — Registry item

A new registry item `ai-elements` (`registry:block`) ships the pattern files plus the three support files, so a consumer runs:

```
npx shadcn@latest add Aesirlvu/project-template/ai-elements
```

It depends on `Aesirlvu/project-template/ui-kit` for the shadcn primitives it builds on.

### S6 — Showcase route

`app/(app)/showcase/ai-elements/page.tsx` renders a live demo per pattern, reachable from the showcase nav. Demos use local mock state — no live model call — so the page works without an API key.

### S7 — Verification

`npm run lint`, `npm run typecheck`, `npm run build` and `npm test` all pass. The showcase AI Elements page renders in a browser with zero console errors and zero React props leaking into the DOM.

### S8 — Docs

`README.md`, `docs/architecture.md`, `docs/conventions.md` and `skills/shadcn-registry-authoring/SKILL.md` document the new item, the icon mapping rule, and the local support files.

## Tasks

| ID | Specs | Route | Status |
| --- | --- | --- | --- |
| T1 | S3, S4 | inline | done — `lib/ai.ts`, `lib/message-animations.ts`, `components/markdown.tsx` written; deps installed and verified |
| T2 | S1, S2 | delegated (parallel writers, disjoint edit surfaces) | done — 21 pattern files in `components/ai-elements/`, contract test 83/83 exports |
| T3 | S6 | inline | done — showcase route with 21 live demos, all mock, no model call |
| T4 | S5 | inline | done — `ai-elements` item added (24 files), registry now has 10 items |
| T5 | S7, S8 | inline | done — lint, tsc, build, test and browser smoke all green; docs updated |

Writer trigger for T2: 21 independent files with disjoint edit surfaces, each far heavier than spinning up one agent per file.

Evidence: commits `558c575`, `5217709`, `4b0b7ea`, `8842642`, `17e3f22` on `feat/ai-elements`.
`npm run lint` 0 · `npx tsc --noEmit` 0 · `npm run build` 18 static routes · `npm test` 7/7 + 15/15 + 21 patterns/83 exports · `registry validate` 10 items · browser smoke on `/showcase/ai-elements`: 21 sections rendered, 0 console errors, 0 prop leaks, ModelSelector selection and Context hover verified.

## Log

- L1 (2026-11-08) — User request, verbatim: "ya que tenemos ai-sdk y shadcn, necesito instalar además ai-elements"
- L2 (2026-11-08) — User attached the full AI Elements documentation for `https://ui.shadcn.com/docs/ai-elements/base/*`, which states the patterns are compositions of shadcn/ui components copied into the project, and lists 21 patterns.
- L3 (2026-11-08) — Research finding: upstream AI Elements are NOT published registry items. `https://ui.shadcn.com/r/styles/base-sera/<name>.json` returns 404 for 20 of the 21 names; only `message` resolves, because it is the plain shadcn/ui component already present in `components/ui/`. The implementation lives only in the docs markdown. The old `@ai-elements` registry namespace (141 items, elements.ai-sdk.dev) is a different, superseded thing that the docs' "Migrating from AI SDK Elements" sections replace.
- L4 (2026-11-08) — Research finding: `getMessageText` exists in no published package. `ai@7.0.165`/`7.0.170` export neither `createChat` nor `getMessageText`; `@ai-sdk/react@4.0.174` exports only `useChat`/`useCompletion`/`useObject`; `@shadcn/helpers@0.3.0` exports only `createChat`. Its origin is `apps/v4/lib/ai.ts` in `shadcn-ui/ui`, a local bridge — so `lib/ai.ts` must be authored locally per S3.
- L5 (2026-11-08) — Research finding: `@/lib/message-animations` and `@/components/markdown` are likewise local to the upstream app, not published.
- L6 (2026-11-08) — Research finding: every shadcn/ui primitive the patterns import already exists in `components/ui/` (64 files, including `trace.tsx`). Only the three modules in S3 are missing.
- L7 (2026-11-08) — Utilities check: `scroll-fade-x` and `scrollbar-none` are used by the upstream patterns. Both already resolve in this repo — `scroll-fade-x` comes from `shadcn/tailwind.css` (which `app/globals.css` imports) and `scrollbar-none` is a Tailwind v4.3.5 built-in. Verified by compiling the project CSS. No new CSS is required.
- L8 (2026-11-13) — Docs cached under `.registry-cache/ai-elements/` (gitignored) after the environment repeatedly wiped `/tmp`.
- L9 (2026-11-16) — T1 done. Support modules written and `npx tsc --noEmit` exits 0. `components/markdown.tsx` wraps `react-markdown` in a `<div data-slot="markdown">` because `react-markdown`'s `Options` type has no `className`/`data-slot` on the root. `scroll-fade-x` and `scrollbar-none` need no new CSS (see L7).
- L10 (2026-11-16) — T4 done. New registry item `ai-elements` (`registry:block`, 24 files: the 21 patterns under `components/ai-elements/` plus `components/markdown.tsx`, `lib/ai.ts`, `lib/message-animations.ts`), `registryDependencies: ["Aesirlvu/project-template/ui-kit"]`, dependencies `@ai-sdk/react`, `@shadcn/helpers`, `ai`, `motion`, `react-markdown`, `remark-gfm`. The registry now has 10 items. `docs/ai-elements-icons.md` was added to the `docs-pack` item.
- L11 (2026-11-16) — T2 launched as four parallel writers with disjoint edit surfaces: W1 (chain-of-thought, plan, queue, sources, task, checkpoint), W2 (subagent, terminal, test-results, tool, stack-trace), W3 (context, suggestion, model-selector, file-tree, inline-citation, confirmation), W4 (message, chat, prompt-input, reasoning). Each writer reads its own doc under `.registry-cache/ai-elements/` and owns exactly the files listed in its `## Allowed edit surfaces`.

L12 (2026-11-16): The AI SDK `Tool` type is the tool definition (`{description, inputSchema, execute}`), not the UI part. `AgentTool` takes `ToolUIPart | DynamicToolUIPart`, and the label is derived from `title`, `toolName` or the `tool-<name>` type, matching how `tool.tsx` derives its title. The tool description lives in the definition and is not reachable from the part.

L13 (2026-11-16): Two writers hit the provider token limit and left broken files on disk; their output was repaired by the parent rather than rewritten. Four type fixes were needed on top of that: `ConversationScrollButton` must not pass `render` to `MessageScrollerButton` (its render prop is parameterised by a different state), `AgentHeaderProps` must be a `button` because `TraceCollapsibleTrigger` renders one, `ToolHeaderProps` must omit `type` because the trigger already declares the button type union, and Base UI menu items use `onClick` rather than the Radix `onSelect`.
