"use client"

import * as React from "react"

import {
  SegmentedControl as SegmentedControlPrimitive,
  SegmentedControlIndicator as SegmentedControlIndicatorPrimitive,
  SegmentedControlItem as SegmentedControlItemPrimitive,
} from "@ui-sdk/react/segmented-control"

import { cn } from "cn"

export type ComposedSegmentedControlProps = React.ComponentProps<
  typeof SegmentedControlPrimitive<string>
> & {
  items: readonly { value: string; label: React.ReactNode }[]
}

export type ComposedSegmentedControlItemProps = React.ComponentProps<
  typeof SegmentedControlItemPrimitive
>

/**
 * A radio group drawn as buttons. ui-sdk owns the keyboard and selection
 * behaviour, the item styles come from the shadcn toggle group.
 */
export function ComposedSegmentedControl({
  items,
  className,
  ...props
}: ComposedSegmentedControlProps) {
  return (
    <SegmentedControlPrimitive
      data-slot="segmented-control"
      className={cn(
        "relative isolate inline-flex w-fit items-center gap-0 rounded-md bg-muted p-0.5",
        "data-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    >
      <SegmentedControlIndicatorPrimitive
        data-slot="segmented-control-indicator"
        className={cn(
          "pointer-events-none absolute z-0 rounded-sm bg-background shadow-sm",
          "transition-[left,top,width,height] duration-200 ease-out"
        )}
      />
      {items.map((item) => (
        <SegmentedControlItemPrimitive
          key={item.value}
          value={item.value}
          data-slot="segmented-control-item"
          className={cn(
            "relative z-10 inline-flex h-8 items-center justify-center rounded-sm px-3 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground focus-visible:ring-ring",
            "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
            "data-[checked]:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
          )}
        >
          {item.label}
        </SegmentedControlItemPrimitive>
      ))}
    </SegmentedControlPrimitive>
  )
}
