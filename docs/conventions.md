# Conventions

## Components

- Use `cn(...)` from `@/lib/utils` for conditional class names. Do not introduce `clsx` or `tailwind-merge` separately.
- Use `cva` for variants; keep variant definitions next to the component.
- Prefer the shadcn primitives in `components/ui/` over raw HTML for interactive elements.
- Use `import type` for type-only imports.

## Styling

- Tailwind CSS 4. No config file; theme tokens live in `app/globals.css`.
- Consume semantic tokens (`bg-card`, `text-muted-foreground`, `border-border`). Avoid hard-coded palette values.
- Use `h-dvh`, never `h-screen`, so mobile browser chrome does not clip content.
- Respect safe areas with `env(safe-area-inset-*, 0px)`.

## Class composition

`tailwind-compose` builds variant-aware class names through the `compose` and
`classnames` helpers exported from `@/lib/utils`. The config routes every
result through `cn`, so Tailwind conflicts resolve the same way as the rest of
the project.

```tsx
import { compose } from "@/lib/utils"

const Button = compose.a<{ $active: boolean }>((conditional) => [
  "inline-flex items-center rounded-md px-3 py-2 text-sm",
  conditional(["bg-primary text-primary-foreground"], ({ $active }) => $active === true),
  conditional(["bg-muted text-muted-foreground"], ({ $active }) => $active !== true),
])
```

Two rules matter when using it:

- Conditions must return a strict `boolean`. Write `active === true`, never
  `active`, because the prop may be optional.
- State props must be prefixed with `$` (`$active`, `$item`). `compose` consumes
  those props to evaluate the conditions and strips them from the rendered
  element. A plain prop such as `item` leaks into the DOM as
  `item="[object Object]"`.

### Two entry points

| Module | Merge | Used by |
| --- | --- | --- |
| `@/lib/utils` | `onDone` hook routes every result through `cn` | Application code under `components/shell/` |
| `@/lib/compose-raw` | No hook | The shadcn primitives in `components/ui/` |

The primitives use the raw entry point so their rendered classes stay
byte-identical to the official shadcn implementation. The hook in `@/lib/utils`
would resolve Tailwind conflicts that the official components leave in place.

### Merging the consumer className

`compose` appends the consumer's `className` after the variant classes without
resolving conflicts. To match the official behaviour, compute the composed
classes first and merge the consumer's `className` once:

```tsx
import { compose, composeClasses } from "@/lib/compose-raw"

const AlertBase = compose.div<{ $variant: AlertVariant }>((conditional) => [
  "relative w-full rounded-lg border p-4",
  conditional(["bg-card text-card-foreground"], ({ $variant }) => $variant === "default"),
])

function Alert({ className, variant = "default", ...props }) {
  return (
    <AlertBase
      $variant={variant}
      className={composeClasses(AlertBase.toClass({ $variant: variant }), className)}
      {...props}
    />
  )
}
```

`composeClasses` is for native elements. Base UI primitives type `className` as
`string | ((state) => string | undefined)`, so use `composeClassesWithState`
there; it returns the function untouched because the state is not resolved yet.

`classnames(...)` from the library drops the consumer's `className`. Use
`toClass(props)` instead.

## Shadcn primitives

Components whose public API exports a `xxxVariants` helper keep
`class-variance-authority`, because consumers depend on that export:
`button`, `badge`, `marker`, `tabs`, `toggle`, `toggle-group`, `button-group`,
and `calendar`. Everything else uses `tailwind-compose` internally.

`npx shadcn@latest add --all` reinstalls the official primitives over this
registry and silently reverts them to `class-variance-authority`. Use
`--overwrite` knowingly or run `--all` before installing this registry.

`hooks/use-mobile.ts` and `components/ui/carousel.tsx` were rewritten from the
official versions to satisfy the `react-hooks/set-state-in-effect` rule of
React 19 and ESLint 9. `use-mobile.ts` uses `useSyncExternalStore`; `carousel.tsx`
derives the scroll state from the Embla API during render and uses a
`requestAnimationFrame` for the initial state, because Embla only emits
`select` when the active index changes.

## Interaction

- Interactive targets are at least 44px tall (`min-h-11`).
- Icon-only buttons require an `aria-label`. Decorative icons get `aria-hidden="true"`.
- Add `touch-manipulation` to controls that respond to taps.
- Hide content with `display: none` or `inert`, never `opacity: 0`, so it leaves the tab order.
- Use ternaries for conditional rendering in React, not `&&`.

## Routing

- Use route groups (`app/(app)/`) to share layouts without changing URLs.
- Export a `viewport` object with `viewportFit: "cover"` when the app renders edge-to-edge on mobile.

## TypeScript

- Strict mode is enabled. No `any`; prefer `unknown` plus narrowing.
- Keep server and client boundaries explicit: add `"use client"` only where interactivity requires it.

## Registry contributions

- Source paths must not start with a dot. Map a dotfile via a non-dot source and a dotfile target.
- `registry:file` and `registry:page` items require a `target`.
- Reference registry items with the full `owner/repo/item` form.
- Never place `package.json` in `files[]`; declare dependencies instead.
