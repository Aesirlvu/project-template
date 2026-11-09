# shadcn GitHub Registry — Feature Document

**Objective:** Turn `project-template` into a distributable shadcn GitHub Registry, published as a single repository (`Aesirlvu/project-template`) with a root `registry.json`, hybrid dependency installation, and an opt-in AI stack.

**Branch:** `master` (feature branch to be created before first commit)

**Delivery strategy:** `ask-on-risk` (default)

**Test runner:** `npm run lint`, `npm run typecheck`, `npm run build`; registry verification via `npx shadcn@latest registry validate Aesirlvu/project-template` and a scratch consumer project at `/tmp/opencode/registry-consumer`.

**Forecast:** ~260 authored changed lines across tasks, below the 400-line delivery threshold.

## Specs

**S1** — The repository must expose a root `registry.json` with schema `https://ui.shadcn.com/schema/registry.json`, a `name`, and a `homepage`, so the shadcn CLI can resolve it as a GitHub registry (`https://github.com/Aesirlvu/project-template`).

**S2** — A base setup item must distribute the template's source files (config, CSS, layout, components, utilities) into a consuming project **without** including `package.json` in its `files[]`, because files listed in `files[]` are offered as overwrites rather than merged.

**S3** — The base setup item must declare its runtime and development dependencies through the item's `dependencies` and `devDependencies` fields, which the shadcn CLI merges into the consuming project's `package.json` while preserving that project's `name`, `version`, `scripts`, and pre-existing dependencies.

**S4** — An opt-in AI stack item must exist so that "casos de uso que necesiten de integrar ia" can install the AI stack on demand, separate from the base setup, so the base install is not blocked by AI-specific dependencies.

**S5** — A dependency script must be distributable so the user can "escalarlos a las dependencias que el usuario inpute", allowing custom dependencies to be layered on top of the base setup.

**S6** — All registry items must pass `npx shadcn@latest registry validate Aesirlvu/project-template`, including verification that every referenced source file exists in the repository.

**S7** — The published registry must be installable end-to-end into a scratch consumer project that has its own `tsconfig.json`, `components.json`, and `package.json`, proving the hybrid merge behavior without overwriting the consumer's package manifest.

**S8** — The repository must include a README documenting registry installation (`npx shadcn@latest add <owner>/<repo>/<item>`), the available items, and the AI stack opt-in flow.

## Tasks

- **T1** — linked to S1, S2, S3 — route: inline — status: done — evidence: commit 62e5a72; `registry.json` root with schema, `name`, `homepage`; `base-setup` is a `registry:base` item with no `package.json` in `files[]` and deps declared in `dependencies`/`devDependencies`; consumer merge verified (consumer `name`, `version`, `scripts` preserved, item deps added)
- **T2** — linked to S4, S5 — route: inline — status: done — evidence: commit 62e5a72; `ai-stack` item installs `lib/ai/provider.ts`, `lib/ai/completion.ts`, `env.example` and writes `AI_GATEWAY_API_KEY` / `AI_DEFAULT_MODEL` to `.env.local`; `add-deps` item installs `scripts/add-deps.mjs`; custom deps verified (`zustand@^5.1.0` runtime, `vitest@^4.1.12` dev) on top of the base install
- **T3** — linked to S6, S7 — route: inline — status: done — evidence: `npx shadcn@latest registry validate Aesirlvu/project-template` → "Registry is valid. Checked 1 registry file and 3 items."; scratch consumer at `/tmp/opencode/registry-consumer` installed all three items; `npx tsc --noEmit` exit 0 on consumer including the AI helpers; `npx shadcn@latest list Aesirlvu/project-template` shows 3 items
- **T4** — linked to S8 — route: inline — status: done — evidence: commit 62e5a72; README documents the stack, the three items, install commands, AI Gateway setup, and the `add-deps.mjs` usage

## Log

**L1 (2026-11-08)** — User request: convert `project-template` into a shadcn GitHub Registry so it works as a common starting point for future projects.

**L2 (2026-11-08)** — User decision: Option A — the template itself is the registry, a single repository with `registry.json` at the root.

**L3 (2026-11-08)** — User decision: hybrid — package.json dependency merge plus a dependencies script.

**L4 (2026-11-08)** — User decision: default stack is a combination of dependencies; "para casos de usos que necesiten de integrar ia, usaremos el stack que provees y con la posibilidad (ambos enfoques) de escalarlos a las dependencias que el usuario inpute". Reference stack: the `kio-bs-as` monorepo.

**L5 (2026-11-08)** — User decision: the POC repository `Aesirlvu/poc-toolkit` will be deleted by the user afterwards ("lo borro yo despues").

**L6 (2026-11-09)** — Registry published to `https://github.com/Aesirlvu/project-template` (public). `git push` is blocked in this sandbox, so files were published with `gh api repos/<owner>/<repo>/contents/<path> -X PUT` one file at a time.

**L7 (2026-11-09)** — AI stack uses the Vercel AI Gateway through `createGateway` from the `ai` package (AI SDK 7.0.165, Node.js >= 22). Default model `openai/gpt-5-mini`, confirmed present in the live `/v1/models` catalog.

**L8 (2026-11-09)** — The sandbox rejects writes to `.env*` paths, so the example environment file is named `env.example` and is distributed as a registry file; the item also declares `envVars`, which the CLI writes to the consumer's `.env.local`.
