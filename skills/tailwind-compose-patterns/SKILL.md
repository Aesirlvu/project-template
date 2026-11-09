---
name: tailwind-compose-patterns
description: Use when composing Tailwind class variants in this project — building a composed component with compose.a, using conditional() for state-dependent classes, or debugging leaked props, strict-boolean conditions, or broken .attrs() typing.
---

# Composing class variants with `tailwind-compose`

## Entry point

Import `compose` and `classnames` from `@/lib/utils`. They come from
`tailwind-compose`, configured in `lib/tailwind-compose.ts` so every result is
merged through `cn`. That keeps Tailwind conflict resolution identical to the
rest of the project.

```tsx
import { compose } from "@/lib/utils"
```

Do not import `tailwind-compose` directly. That skips the `cn` merge hook and
lets conflicting utilities both survive.

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

## Known library limitations

- **`.attrs()` is broken in the type definitions** for `compose.a`. It resolves
  the attribute object to `never` and reports "Type 'never' has no call
  signatures". Apply defaults inside the component body or express them as
  conditions that already handle `undefined`.
- **`compose.a(composer, defaults)` does not exist.** The signature accepts a
  single argument.
- **Polymorphic rendering requires `as`.** `compose.a` renders an `<a>` by
  default. Pass `as={Link}` for an internal link or `as="a"` for an external
  one.
- **`toClass()` returns the merged class string** for a given prop set. Use it
  when you need the classes without rendering the composed component.

## Verification

A composed component is not exercised by the production build unless it is
rendered by a route. Verify it in a running app: check that the expected
conditional classes are present and that no state props leaked into the
markup.
