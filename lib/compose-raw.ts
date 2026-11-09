import { cn } from "cn"
import { defineConfig } from "tailwind-compose"

/**
 * Compose entry point for the upstream shadcn components.
 *
 * The official components build their class name as `cn(variants(...), className)`:
 * `class-variance-authority` concatenates the base and variant classes, then `cn`
 * resolves the conflicts between them and the consumer's `className`.
 *
 * `compose` concatenates the base and conditional classes but does not merge
 * them, and the `onDone` hook cannot do it either: the consumer's `className` is
 * appended after the merge, so a conflicting class from the variant survives.
 *
 * Use `composeClasses` to reproduce the official output exactly — it composes
 * the variant classes and then applies `cn` over the consumer's `className`.
 */
export const { compose, classnames } = defineConfig({})

/**
 * Builds a class name the same way the upstream shadcn components do:
 * the composed variant classes first, then the consumer's `className`, merged
 * by `cn` so the consumer always wins a conflict.
 *
 * Use this for native elements, whose `className` is always a string.
 */
export function composeClasses(composed: string, className?: string): string {
  return cn(composed, className)
}

/**
 * Same as `composeClasses`, but for Base UI primitives that type `className`
 * as `string | ((state) => string | undefined)`.
 *
 * A render prop cannot be merged here because it needs the resolved element
 * state, so it is returned untouched and the primitive keeps rendering it.
 */
export function composeClassesWithState<State>(
  composed: string,
  className?: string | ((state: State) => string | undefined)
): string | ((state: State) => string | undefined) {
  if (typeof className === "function") {
    return className
  }

  return cn(composed, className)
}
