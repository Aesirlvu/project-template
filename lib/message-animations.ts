import type { Variants } from "motion/react"

export type MessageAnimation = {
  id: string
  name: string
  variants: Variants
}

export const ANIMATIONS: MessageAnimation[] = [
  {
    id: "fade",
    name: "Fade",
    variants: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
  },
  {
    id: "slide-up",
    name: "Slide up",
    variants: {
      hidden: { opacity: 0, y: 8 },
      visible: { opacity: 1, y: 0 },
    },
  },
  {
    id: "slide-side",
    name: "Slide side",
    variants: {
      hidden: { opacity: 0, x: -8 },
      visible: { opacity: 1, x: 0 },
    },
  },
  {
    id: "pop",
    name: "Pop",
    variants: {
      hidden: { opacity: 0, scale: 0.95 },
      visible: { opacity: 1, scale: 1 },
    },
  },
  {
    id: "blur",
    name: "Blur",
    variants: {
      hidden: { opacity: 0, filter: "blur(4px)" },
      visible: { opacity: 1, filter: "blur(0px)" },
    },
  },
  {
    id: "slide-down",
    name: "Slide down",
    variants: {
      hidden: { opacity: 0, y: -8 },
      visible: { opacity: 1, y: 0 },
    },
  },
]

export const MESSAGE_ANIMATIONS: Record<string, Variants> = Object.fromEntries(
  ANIMATIONS.map((animation) => [animation.id, animation.variants])
)
