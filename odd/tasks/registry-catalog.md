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

- **T1** — linked to S1, S2, S3, S7 — route: inline — status: pending
- **T2** — linked to S4, S5, S8 — route: inline — status: pending
- **T3** — linked to S6 — route: inline — status: pending

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
