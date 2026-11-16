# Feature: shadcn + ui-sdk composition

Objective: build the showcase for the shadcn/ui-sdk combination and write a skill that documents how the two layers compose and complement each other, with ordering and maintainability guidance.

Branch: `feat/shadcn-uisdk-composition`

Delivery strategy: `ask-on-risk`

Test runner: `npm test` (carousel state + class parity + ai-elements contract) plus `npx tsc --noEmit`, `npm run lint`, `npm run build`.

## Specs

S1. The showcase route `app/(app)/showcase/ui-sdk/` presents one live section per composition, following the same pattern as the AI Elements showcase, and it is reachable from the showcase navigation.

S2. `components/composed/` holds the compositions that pair a ui-sdk behavior with a shadcn presentation. Each composition keeps the ui-sdk behavior intact and delegates the visual layer to the repo's shadcn components.

S3. `components/primitives/` holds behavior this project owns, written with `definePrimitive` and `createParts` following the ui-sdk path 2 workflow: an APG spec first, then the primitive, then the React parts, then tests.

S4. The compositions use Tabler icons. The ui-sdk components are unstyled, so every visual state comes from the shadcn presentation and the documented `data-*` attributes, never from inline styles.

S5. A skill documents the composition and complementarity between shadcn and ui-sdk, covering when to use each layer, the ordering rules, and the maintainability constraints.

S6. The registry distributes the compositions and the project's own primitives through a new item, so a consumer can install them with the shadcn CLI.

S7. The delivered code passes `npm run lint`, `npx tsc --noEmit`, `npm run build` and `npm test`, and the showcase renders without console errors or leaked DOM props.

S8. The ui-sdk layer stays declared in `app/globals.css` and the repository's own design tokens stay untouched.

## Tasks

T1. (S3, inline) Write the data grid primitive: APG spec, `definePrimitive` over `createGridFocus` and `createCellRange`, the React parts, and its tests. Done: `components/primitives/data-grid.spec.md`, `data-grid.primitive.ts`, `data-grid.tsx`, `scripts/data-grid-contract.test.mjs`.

T2. (S2, inline) Write the three compositions: rating, tree, segmented control. Done: `components/composed/{rating,tree,segmented-control}.tsx`.

T3. (S1, inline) Build the showcase route with a live demo per composition and register it in the showcase navigation. Done: `app/(app)/showcase/ui-sdk/`, nav entry added.

T4. (S5, inline) Write the composition skill and add it to the agent skills item. Done: `skills/shadcn-uisdk-composition/SKILL.md` plus the `.agents/skills/` copy, registered in `agent-skills`.

T5. (S6, inline) Add the registry item for the compositions and the project's own primitives. Done: the `ui-primitives` item with 6 files, depending on `ui-kit` and the ui-sdk packages.

T6. (S7, S8, inline) Verify the delivery: lint, typecheck, build, tests, registry validation, and a browser pass over the showcase. Done: format, lint, tsc, build (19 routes), npm test (4 suites), registry validate (11 items), browser pass on both themes with the contrast measured.

## Log

L1. "bien, genial, vamos a realizar un showcase y con lo aprendido y descubierto, en temas de orden y de mantenibilidad, realizarás una skill que informe sobre esta composición y complementariedad entre shadcn y uisdk"

L2. Scope decision taken by the parent from the approved proposal: three compositions (rating, tree, segmented control), one project-owned primitive (data grid), the showcase and the skill. The user approved the proposal with "bien, genial" without answering the two scope questions, so the recommendation already presented was followed.

L3. Layer split measured against the installed packages: 30 components overlap between the 69 `@ui-sdk/react` entries and the 63 `components/ui/` files. ui-sdk carries behavior (keyboard, focus, selection, dismissal, ARIA, RTL, SSR, agent actions) and ships no presentation; shadcn carries presentation and public contracts. ui-sdk never replaces shadcn because it lacks 30 presentation pieces, and shadcn does not cover rating, tree, waterfall or timeline without rewriting behavior by hand.

L4. Composition contracts read from the installed docs. Rating renders its children once per star, so a single `RatingItem` holds the icon. Tree nests `TreeItem` > `TreeItemLabel` > `TreeItemIndicator` with `TreeGroup` for branches, and the row is styled through `TreeItemLabel` because a background on the item would cover its children. Segmented control nests `SegmentedControlIndicator` plus one `SegmentedControlItem` per value.

L5. `definePrimitive` signature confirmed from the installed types: `name`, `state`, `api`, `slots`, plus `options`, `sync`, `controlled` and `agent`. `createGridFocus` owns one tab stop and arrow navigation, `createCellRange` extends a rectangle selection from a moved cell. Both are `@experimental`, and each cell renders a stable id such as `"1:2"` so the primitive can tell cells apart.

L6. T1 done. `components/primitives/data-grid.spec.md` holds the APG spec written before the code. `data-grid.primitive.ts` holds the primitive and `data-grid.tsx` the parts, split into two files because Next resolved `data-grid.ts` and `data-grid.tsx` as the same module. `scripts/data-grid-contract.test.mjs` checks the roles live in the slots and not in `attrs`, that the row counts come from the state, that the cell slot handles its 21 keys, and that the parts file is a client module. Browser pass: 4 rows, 3 column headers, 9 cells with stable ids, one tab stop, the arrow keys move the active cell, Shift+ArrowRight extends the rectangle with the right range edges, no console errors, no leaked props.

L7. T2 done. `components/composed/` holds the three fusions: `rating.tsx`, `tree.tsx` and `segmented-control.tsx`. Each keeps the ui-sdk part as the element and applies the shadcn classes to it. Browser pass: the segmented control moves its checked item, the rating follows the radio group with the arrow keys, and the tree expands a branch and reports the right `aria-level`, `aria-posinset` and `aria-setsize`.

L8. T3 and T4 done. The showcase lives at `/showcase/ui-sdk` with one live section per composition, and the composition skill ships as `skills/shadcn-uisdk-composition/SKILL.md` with an identical copy in `.agents/skills/`, following the layout of the installed ui-sdk skill.

L9. Two contrast problems were found in a real browser and fixed. The inactive segmented item measured 4.39 against `bg-muted`, so it uses `text-foreground/70`. The filled rating star measured 2.13 on white, so it uses `amber-600`.

L10. The rating tree kept the light theme color in the dark theme. The ui-sdk tokens are built with `light-dark()`, which follows `color-scheme`, and this repo never set it. `color-scheme: light` on `:root` and `color-scheme: dark` on `.dark` in `app/globals.css` align both systems. The tree label went from 1.12 to 16.97 and the segmented item from 14.15 to 14.27 in the dark theme.

L11. The `script tag` console error does not come from this repo: every script tag in the page is a Next chunk, the message names the next-devtools injection, and the dev server log holds no matching entry.
