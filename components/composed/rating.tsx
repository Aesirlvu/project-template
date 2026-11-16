"use client"

import * as React from "react"

import {
  Rating as RatingPrimitive,
  RatingItem as RatingItemPrimitive,
} from "@ui-sdk/react/rating"

import { IconStar } from "@tabler/icons-react"

import { cn } from "cn"

export type ComposedRatingProps = Omit<
  React.ComponentProps<typeof RatingPrimitive>,
  "children"
> & {
  max?: number
  label?: string
}

/**
 * A star rating. ui-sdk owns the radio semantics, the arrow keys and the
 * half-step support; the stars are drawn with Tabler.
 */
export function ComposedRating({
  max = 5,
  label = "Rating",
  className,
  ...props
}: ComposedRatingProps) {
  return (
    <RatingPrimitive
      data-slot="rating"
      aria-label={label}
      max={max}
      className={cn("inline-flex items-center gap-0.5", className)}
      {...props}
    >
      <RatingItemPrimitive
        data-slot="rating-item"
        className={cn(
          "relative inline-flex size-6 items-center justify-center text-muted-foreground",
          "data-[filled]:text-amber-600 data-[partial]:text-amber-600",
          "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
        )}
      >
        {({ fill }: { fill: number }) => (
          <IconStar
            aria-hidden="true"
            className="size-5"
            fill={fill > 0 ? "currentColor" : "none"}
            strokeWidth={1.5}
          />
        )}
      </RatingItemPrimitive>
    </RatingPrimitive>
  )
}
