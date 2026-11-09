import { cn } from "cn"
import { defineConfig } from "tailwind-compose"

/**
 * Shared `tailwind-compose` configuration.
 *
 * The `onDone` hook routes every composed class list through `cn`, which
 * resolves Tailwind conflicts the same way the rest of the project does.
 */
export const { compose, classnames } = defineConfig({
  hooks: {
    onDone: (className) => cn(className),
  },
})
