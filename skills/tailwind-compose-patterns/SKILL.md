---
name: tailwind-compose-patterns
description: Use when composing Tailwind class variants in this project — building a composed component with compose.a, using conditional() for state-dependent classes, migrating a cva definition to compose, or debugging leaked props, strict-boolean conditions, broken .attrs() typing, or a className that never reaches the element.
---

# Composing class variants with `tailwind-compose`

## Two entry points

| Module | Merge | Used by |
| --- | --- | --- |
| `@/lib/utils` | `onDone` hook routes every result through `cn` | Application code under `components/shell/` |
| `@/lib/compose-raw` | No hook | The shadcn primitives in `components/ui/` |

```tsx
import { compose } from "@/lib/utils"          // application code
import { compose, composeClasses } from "@/lib/compose-raw"  // primitives
```

Do not import `tailwind-compose` directly. That skips the `cn` merge hook and
lets conflicting utilities both survive.

The primitives use the raw entry point on purpose: the official shadcn
components build their class name as `cn(cva(...), className)`, and the hook
would resolve conflicts the official implementation leaves in place.

## Two rules that are easy to get wrong

1. **Conditions must return a strict boolean.** Write `active === true`, never
   `active`. The prop may be optional, and the condition type is
   `(props: P) => boolean`, so `boolean | undefined` fails to compile.

2. **State props must be prefixed with `$`.** `compose` consumes `$`-prefixed
   props to evaluate the conditions and strips them from the rendered element.
   A plain prop such as `item` is forwarded to the DOM and appears as
   `item="[object Object]"`.

```tsx
const NavLinkBase = compose.a<{ $item: NavItem; $active: boolean }>(
  (conditional) => [
    "flex items-center rounded-md px-3 py-2 text-sm",
    conditional(["bg-primary font-medium"], ({ $active }) => $active === true),
    conditional(["text-muted-foreground"], ({ $active }) => $active !== true),
    conditional(["pointer-events-none opacity-50"], ({ $item }) => $item.disabled === true),
  ]
)
```

## Merging the consumer className

`compose` appends the consumer's `className` to the composed classes **without**
resolving conflicts, and the composed component appends whatever `className` it
receives to the composed classes as well. Passing an already merged string to a
composed component therefore duplicates every class.

Compute the classes and merge the consumer's `className` once, then render a
**native element**:

```tsx
const AlertBase = compose.div<{ $variant: AlertVariant }>((conditional) => [
  "relative w-full rounded-lg border p-4",
  conditional(["bg-card text-card-foreground"], ({ $variant }) => $variant === "default"),
])

function Alert({ className, variant = "default", ...props }) {
  return (
    <div
      data-slot="alert"
      className={composeClasses(
        AlertBase.toClass({ $variant: variant }),
        className
      )}
      {...props}
    />
  )
}
```

Rendering a native element is equivalent here: the composed component only
adds the target tag, the `$`-prefixed props it strips, and the `className` it
appends. None of the migrated components forward a `ref`.

`composeClasses` accepts a `string` only. Base UI primitives type `className`
as `string | ((state: State) => string | undefined)`; use
`composeClassesWithState` there. It returns the function untouched, because the
state is not resolved at composition time. Base UI primitives do not append
the `className` themselves, so passing a merged string to them is safe.

## Migrating a cva definition

Components whose public API exports a `xxxVariants` helper keep
`class-variance-authority`, because consumers depend on that export. Everything
else can move to `compose`:

```tsx
const AlertBase = compose.div<{ $variant: AlertVariant }>((conditional) => [
  "relative w-full rounded-lg border p-4",
  conditional(["bg-card text-card-foreground"], ({ $variant }) => $variant === "default"),
  conditional(["bg-destructive/10 text-destructive"], ({ $variant }) => $variant === "destructive"),
])
```

A variant whose class string is empty needs no `conditional` at all. Keep the
public export when the original had one, by wrapping the composed base:

```tsx
export const navigationMenuTriggerStyle = () => navigationMenuTriggerClasses.toClass()
```

## Known library limitations

- **`.attrs()` is broken in the type definitions** for `compose.a`. It resolves
  the attribute object to `never` and reports "Type 'never' has no call
  signatures". Apply defaults inside the component body or express them as
  conditions that already handle `undefined`.
- **`compose.a(composer, defaults)` does not exist.** The signature accepts a
  single argument.
- **`classnames(...)` drops the consumer's `className`.** Use `toClass(props)`
  instead.
- **Polymorphic rendering requires `as`.** `compose.a` renders an `<a>` by
  default. Pass `as={Link}` for an internal link or `as="a"` for an external
  one.
- **`toString()` takes no arguments.** Use `toClass(props)` when you need the
  classes for a specific prop set.
- **A composed component must be PascalCase** to be usable as JSX. A lowercase
  name fails with "Property does not exist on type 'JSX.IntrinsicElements'".
- **`compose("div", fn)` returns a component, not a class string.** Use
  `toString()` or `toClass()` for the string.

## Verification

A composed component is not exercised by the production build unless it is
rendered by a route. Verify it in a running app: check that the expected
conditional classes are present and that no state props leaked into the
markup.

`scripts/class-parity.probe.mjs` compares the class strings declared by each
migrated primitive against the official registry raw files, and
`scripts/carousel-state.probe.mjs` covers the carousel scroll-state derivation.
Run both from the repository root after changing a variant definition.
