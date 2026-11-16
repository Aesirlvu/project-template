---
name: shadcn-uisdk-composition
description: Compose shadcn/ui presentation with ui-sdk behavior in one component. Use when building a component that needs keyboard navigation, focus management or ARIA that shadcn does not ship (rating, tree, segmented control, data grid), when deciding whether to extend a shadcn component or write a primitive, or when reviewing a composition that mixes both layers.
---

# Composing shadcn/ui with ui-sdk

Two layers that solve different problems. Mixing them without a rule produces
components that fight each other.

| Layer | Owns | Does not own |
| --- | --- | --- |
| **shadcn/ui** (this repo's `components/ui/`) | Presentation: classes, design tokens, public API, visual states | Behavior that was never written: keyboard models, focus management, ARIA wiring for missing widgets |
| **ui-sdk** (`@ui-sdk/react`, `@ui-sdk/core`) | Behavior: keyboard, focus, selection, dismissal, ARIA, RTL, SSR | Presentation: ships no styles of its own beyond an optional `web.css` |

## The rule

**ui-sdk never replaces shadcn.** shadcn ships 63 components; ui-sdk has no
`card`, `badge`, `alert`, `table`, `skeleton`, `spinner`, `bubble`, `kbd`,
`item`, `marker`, `chart`, `sheet`, `sidebar`, `code-block`, `message`,
`trace`, `questionnaire`, `input-group`, `dropdown-menu`, `context-menu`,
`empty`, `breadcrumb`, `aspect-ratio`, `direction`, `toggle-group`,
`radio-group`, `native-select`, `attachment`, `button-group` or `input-otp`.
Replacing a shadcn component with the ui-sdk one means rebuilding its look.

**shadcn never covers ui-sdk either.** There is no `rating`, `tree`,
`waterfall`, `timeline`, `meter`, `segmented-control`, `token-input`,
`listbox`, `number-input`, `password-input`, `otp-input`, `date-input`,
`time-input`, `file-input`, `image-cropper`, `color-picker`, `trigger-menu`,
`preferences` or `shortcuts`. Writing those by hand means writing keyboard
navigation, focus and ARIA from scratch.

So: **the behavior comes from ui-sdk, the presentation comes from shadcn.**

## The three directories

```
components/ui/          shadcn primitives, presentation only
components/primitives/  own behavior, no style: definePrimitive + createParts
components/composed/    the fusion: ui-sdk behavior inside shadcn presentation
```

- `components/primitives/` holds primitives ui-sdk does not ship. They own
  behavior and expose state, and carry no classes.
- `components/composed/` holds the wrappers that put ui-sdk parts inside
  shadcn classes. This is where the fusion lives.

If you find yourself adding a `className` to a primitive, it belongs in
`composed/` instead.

## Composing a ui-sdk component with shadcn

### 1. Import by entry

```tsx
import { RatingPrimitive, RatingItemPrimitive } from "@ui-sdk/react/rating"
import { TreePrimitive } from "@ui-sdk/react/tree"
```

There is no root export. `@ui-sdk/react` has 69 entries, one per component.
Never import `@ui-sdk/core/internal/*`.

### 2. Keep ui-sdk's DOM, apply shadcn's classes

Render the ui-sdk part as the element and give it shadcn's classes:

```tsx
<SegmentedControlPrimitive className="bg-muted relative isolate inline-flex w-fit items-center rounded-md p-0.5">
  <SegmentedControlIndicatorPrimitive className="z-0 absolute" />
  {items.map((item) => (
    <SegmentedControlItemPrimitive
      key={item.value}
      value={item.value}
      className="text-muted-foreground z-10 rounded-sm px-3 py-1 text-sm data-[checked]:text-foreground"
    >
      {item.label}
    </SegmentedControlItemPrimitive>
  ))}
</SegmentedControlPrimitive>
```

The behavior stays in the ui-sdk part. The classes stay in the wrapper. Neither
knows about the other.

### 3. Style from state, never from a variable

ui-sdk exposes state as attributes: `data-checked`, `data-open`,
`data-pressed`, `data-selected`, `data-expanded`, `data-disabled`,
`data-readonly`, `data-highlighted`, `data-filled`, `data-partial`.

Style with `data-[checked]:` variants or `group-data-[selected]:`. Never
compute a class in JS from a value you read from state: that re-renders on
every state change and breaks the server render.

`--rating-fill` (0 to 1) is the exception the package documents: use it for a
partial fill, and read it in the icon, not in a class attribute.

### 3b. Never size a measured part yourself

Some ui-sdk parts measure themselves and expose the result as CSS variables on
the part itself: the segmented control writes `--segmented-control-indicator-left`,
`-width`, `-height` and `-top` on its indicator element. The package's
stylesheet consumes them.

Do not give that part a width, a height or a position of your own. A single
`size-[calc(100%-0.25rem)]` overrode the measured width and made the indicator
cover every tab instead of the active one.

Rule: if the component measures it, let it measure it. Style color, radius,
shadow and transitions, and leave the geometry to the variables.

### 4. Never re-declare a role

If ui-sdk ships the component, it ships the role, the keyboard model and the
focus management. A `role="listbox"` next to an installed ui-sdk package is
almost always a bug.

### 5. Name every control

Use the label part (`FieldLabel`, `SelectLabel`, `DialogTitle`) or
`aria-label`. People using screen readers and agents both find controls by
name.

### 6. Handle the null value

ui-sdk values can be `null` when the widget is deselectable:

```tsx
onValueChange={(next) => setValue(next ?? fallback)}
```

### 7. Keep the shadcn composition on top

When a ui-sdk part wraps a shadcn part, the shadcn part keeps its own public
contract. `ComposedTree` renders a ui-sdk `TreeItemLabel` but the row styling
belongs to the label, not to the item: the item's background would cover its
children.

## Writing a primitive ui-sdk does not ship

For a widget neither library provides (a data grid, a transfer list, an emoji
picker), follow ui-sdk's path 2.

### 1. Write the spec first

Pick the WAI-ARIA APG pattern and write down the roles, the states and the
keys before any code. Then decide, in writing:

- Where focus goes when the widget opens, and when it tabs.
- Whether selection follows focus.
- Who owns Escape.
- Where focus goes when the focused element disappears.
- Which keys have no APG rule, and which one you chose.

Keep the spec next to the code, as `<name>.spec.md`.

### 2. Write the primitive

```ts
import { definePrimitive, createChange, createGridFocus, createCellRange, selects, byCell, byCellRange } from "@ui-sdk/core"

export const dataGrid = definePrimitive({
  name: "data-grid",
  options: { rows: "number", columns: "number" },
  state: (options) => ({
    active: null,
    range: null,
    rowCount: options.rows,
    colCount: options.columns,
  }),
  api: (context) => {
    const change = createChange(context)
    const grid = createGridFocus(context, {
      key: "active",
      rows: () => context.options().rows,
      cols: () => context.options().columns,
    })
    const range = createCellRange(context, { key: "range", grid, rows: ..., cols: ... })
    return { grid, range }
  },
  slots: (slot) => ({
    root: slot({ role: "grid", keys: { none: "Focus stays on a cell." }, attrs: (state) => ({ "aria-rowcount": String(state.rowCount) }) }),
    cell: slot({
      role: "gridcell",
      focus: "roving",
      selects: selects({ active: byCell, range: byCellRange }),
      keys: ["ArrowUp", "ArrowDown", "Escape"],
      attrs: (state, { props, api }) => ({ tabindex: api.grid.tabIndex(state, props) }),
    }),
  }),
})
```

Rules that bite:

- `context.options` is a **function**: `context.options().rows`.
- `attrs` is **pure**. It never reads live state. Put anything the markup
  needs into `state`.
- The `role` goes on the **slot**, never inside `attrs`.
- A role with focus or press requires the matching slot fields, or
  `{ none: "why" }`.
- Every visible change goes through `change(key, value, { reason })`.
- `$`-prefixed state props are consumed and never reach the DOM.

### 3. Write the parts

```tsx
"use client"
import { createParts } from "@ui-sdk/react/primitive"
import { dataGrid } from "./data-grid.primitive"

export const { Root: DataGridRoot, Row: DataGridRow, Cell: DataGridCell } = createParts(dataGrid, {
  root: "div",
  row: "div",
  cell: "div",
})
```

`createParts` is the whole adapter: it renders, and it does not add
handlers, focus moves, ARIA or `data-slot`. The file needs `"use client"`.

### 4. Reuse the behavior blocks

Do not reimplement `createRovingFocus`, `createListbox`, `createGridFocus`,
`createCellRange`, `createSelection`, `createTypeahead`,
`createInputHistory`, `createFocusRecovery`, `createReorder`, `createPopup`,
`createTreeCollection`. If you need a new one, write it as
`create<Thing>(context, options)` with its own tests.

### 5. Write the tests

Every primitive gets tests, and the interface that uses it gets at least the
agent test from ui-sdk's `agent-ready.md`. jsdom cannot see color: check
contrast in a real browser.

## Order of decisions

1. Does shadcn already ship the component? Use it. Do not add ui-sdk.
2. Does ui-sdk ship it? Compose it with shadcn classes.
3. Neither? Write a primitive in `components/primitives/`, then compose it
   in `components/composed/`.

## What to check in a review

- A ui-sdk part that lost its classes, or a shadcn class applied to the wrong
  part.
- A `role` declared by hand next to an installed ui-sdk component.
- State read in JS to compute a class, instead of a `data-*` variant.
- A width, height or position set on a part that measures itself.
- A primitive with classes in it (belongs in `composed/`).
- A `attrs` function reading live state.
- An uncontrolled widget whose value can be `null` and is used without a
  fallback.
- A missing label on a control.

## Files

- `components/primitives/` — own behavior, no style.
- `components/composed/` — the fusion.
- `components/primitives/data-grid.spec.md` — a worked APG spec.
- `scripts/data-grid-contract.test.mjs` — the contract test for the grid.
- `app/(app)/showcase/ui-sdk/` — the live showcase of the compositions.
