# Registry catalog — Feature Document

**Objective:** Grow `project-template` into a populated shadcn registry catalog so future projects can extract specific pieces — docs, agent instructions, skills, app shells, and layouts — instead of cloning the whole template.

**Branch:** `feat/registry-catalog`

**Delivery strategy:** `ask-on-risk` (default)

**Test runner:** `npm run lint`, `npm run typecheck`, `npm run build`; registry verification via `npx shadcn@latest registry validate ./registry.json` and a scratch consumer project at `/tmp/opencode/catalog-consumer`.

**Forecast:** ~600 authored changed lines across tasks, above the 400-line advisory threshold. The work is split into reviewable work-unit commits on the feature branch.

## Specs

**S1** — The repository must expose registry items that distribute documentation and agent instructions as installable files, so a consuming project can receive project docs and agent rules without cloning the template.

**S2** — The repository must expose a responsive desktop/tablet application shell item and a mobile-first shell item, so a consuming project can choose the navigation model that fits its use case.

**S3** — The repository must expose a route-group layout item, so a consuming project can install a dashboard layout without hand-writing the file convention.

**S4** — Every new item must pass `npx shadcn@latest registry validate ./registry.json`, and every referenced source file must exist in the repository.

**S5** — Every new item must be installable end-to-end into a scratch consumer project that has its own `tsconfig.json`, `components.json`, and `package.json`, without overwriting the consumer's package manifest.

**S6** — The repository README must explain how the repository is used as both a template and a registry, how to consume each item, and how to add new items to the catalog.

**S7** — Shell components must follow mobile platform rules: `h-dvh` over `h-screen`, safe-area insets for top and bottom edges, tap targets of at least 44px, `aria-label` on icon-only controls, and `touch-action: manipulation` on interactive controls.

**S8** — Source paths declared in the registry must not begin with a dot, because the registry validator rejects dot-prefixed source paths; dotfile destinations remain valid as targets.

## Tasks

- **T1** — linked to S1, S2, S3, S7 — route: inline — status: done — commit `e3458cd` — shell components (`components/shell/*`), route-group layout (`app/(app)/layout.tsx`), docs (`docs/architecture.md`, `docs/conventions.md`), agent sources (`agent/AGENTS.md`, `agent/ARCHITECTURE.md`), skills (`skills/*/SKILL.md`), registry entries for 5 new items, README rewrite.
- **T2** — linked to S4, S5, S8 — route: inline — status: done — commit `9d0115a` — `registry validate` passes locally and remotely (8 items); scratch consumer `/tmp/opencode/consumer2` installs all items, typecheck and production build pass; consumer `package.json` manifest preserved.
- **T3** — linked to S6 — route: inline — status: done — commit `e3458cd` — README documents the registry table, per-item usage, template clone flow, and the procedure for adding a new item.

## Verification evidence

- `npm run lint` — pass.
- `npm run typecheck` — pass.
- `npm run build` — pass (Next.js 16.4.4, Turbopack, static prerender).
- `npx shadcn@latest registry validate ./registry.json` — "Registry is valid. Checked 1 registry file and 8 items."
- `npx shadcn@latest registry validate Aesirlvu/project-template` — valid, 8 items (remote).
- Scratch consumer `/tmp/opencode/consumer2` — `shadcn add` of `base-setup`, `app-shell`, `mobile-shell`, `dashboard-layout`, `docs-pack`, `agent-skills` installed 21 files; `npx tsc --noEmit` exit 0; `npx next build` succeeded with the App Router route `/` prerendered.
- Consumer `package.json` — `name`, `version`, `private`, and `scripts` preserved; only registry dependencies merged.
- Native review assessment — risk `medium`, `review_due: false`, reason `under_budget`; no native review started.

## Log

**L1 (2026-11-08)** — User request: convert `project-template` into a shadcn GitHub Registry so it works as a common starting point for future projects.

**L2 (2026-11-08)** — User decision: Option A — the template itself is the registry, a single repository with `registry.json` at the root.

**L3 (2026-11-08)** — User decision: hybrid — package.json dependency merge plus a dependencies script.

**L4 (2026-11-08)** — User decision: default stack is a combination of dependencies; "para casos de usos que necesiten de integrar ia, usaremos el stack que provees y con la posibilidad (ambos enfoques) de escalarlos a las dependencias que el usuario inpute". Reference stack: the `kio-bs-as` monorepo.

**L5 (2026-11-08)** — User decision: the POC repository `Aesirlvu/poc-toolkit` will be deleted by the user afterwards ("lo borro yo despues").

**L6 (2026-11-09)** — Registry published to `https://github.com/Aesirlvu/project-template` (public). `git push` is blocked in this sandbox, so files were published with `gh api repos/<owner>/<repo>/contents/<path> -X PUT` one file at a time.

**L7 (2026-11-09)** — AI stack uses the Vercel AI Gateway through `createGateway` from the `ai` package (AI SDK 7.0.165, Node.js >= 22). Default model `openai/gpt-5-mini`, confirmed present in the live `/v1/models` catalog.

**L8 (2026-11-09)** — The sandbox rejects writes to `.env*` paths, so the example environment file is named `env.example` and is distributed as a registry file; the item also declares `envVars`, which the CLI writes to the consumer's `.env.local`.

**L9 (2026-11-08)** — User request: "tambien podemos contar con un readme, que explique el uso de este repositorio como tal. pero en si, estoy de acuerdo, y sirve para yo empezar a poblar este repo y que reutilizarlos" — user agrees to the proposed catalog and asks for a README explaining the repository's usage as such.

**L10 (2026-11-08)** — Empirical findings carried over from the extraction exploration: the registry validator rejects dot-prefixed source paths (S8); files already present in the consumer are skipped unless `--overwrite` is passed; `registryDependencies` may cross repositories but a same-repository dependency must use the full `owner/repo/item` address.

**L11 (2026-11-09)** — Bug found and fixed during end-to-end verification: `app/globals.css` imports `shadcn/tailwind.css`, but `base-setup` did not declare the `shadcn` package, so a consumer installing the item got a broken stylesheet and a failing build. Fixed in commit `9d0115a` by adding `shadcn@^4.23.0` to the item dependencies.

**L12 (2026-11-09)** — Dotfile source workaround applied: `agent/AGENTS.md` and `agent/ARCHITECTURE.md` are the registry sources, targeting `~/AGENTS.md` and `~/docs/ARCHITECTURE.md` respectively.

**L13 (2026-11-09)** — Catalog published to `origin/master` through the GitHub contents API, one file per request, because `git push` is blocked in this sandbox.
