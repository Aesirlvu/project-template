import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { compose, composeClasses } from "@/lib/compose-raw"

const bubbleGroupClasses = compose.div(() => ["flex min-w-0 flex-col gap-2"])

function BubbleGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="bubble-group"
      className={composeClasses(bubbleGroupClasses.toClass(), className)}
      {...props}
    />
  )
}

type BubbleVariant =
  | "default"
  | "secondary"
  | "muted"
  | "tinted"
  | "outline"
  | "ghost"
  | "destructive"

const BubbleBase = compose.div<{ $variant: BubbleVariant }>((conditional) => [
  "group/bubble relative flex w-fit max-w-[80%] min-w-0 flex-col gap-1 group-data-[align=end]/message:self-end data-[align=end]:self-end data-[variant=ghost]:max-w-full",
  conditional(
    [
      "*:data-[slot=bubble-content]:bg-primary *:data-[slot=bubble-content]:text-primary-foreground [&>[data-slot=bubble-content]:is(button,a):hover]:bg-primary/80",
    ],
    ({ $variant }) => $variant === "default"
  ),
  conditional(
    [
      "*:data-[slot=bubble-content]:bg-secondary *:data-[slot=bubble-content]:text-secondary-foreground [&>[data-slot=bubble-content]:is(button,a):hover]:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)]",
    ],
    ({ $variant }) => $variant === "secondary"
  ),
  conditional(
    [
      "*:data-[slot=bubble-content]:bg-muted [&>[data-slot=bubble-content]:is(button,a):hover]:bg-[color-mix(in_oklch,var(--muted),var(--foreground)_5%)]",
    ],
    ({ $variant }) => $variant === "muted"
  ),
  conditional(
    [
      "*:data-[slot=bubble-content]:bg-[oklch(from_var(--primary)_0.93_calc(c*0.4)_h)] *:data-[slot=bubble-content]:text-foreground dark:*:data-[slot=bubble-content]:bg-[oklch(from_var(--primary)_0.3_calc(c*0.4)_h)] [&>[data-slot=bubble-content]:is(button,a):hover]:bg-[oklch(from_var(--primary)_0.88_calc(c*0.5)_h)] dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-[oklch(from_var(--primary)_0.35_calc(c*0.5)_h)]",
    ],
    ({ $variant }) => $variant === "tinted"
  ),
  conditional(
    [
      "*:data-[slot=bubble-content]:border-border *:data-[slot=bubble-content]:bg-background [&>[data-slot=bubble-content]:is(button,a):hover]:bg-muted [&>[data-slot=bubble-content]:is(button,a):hover]:text-foreground dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-input/30",
    ],
    ({ $variant }) => $variant === "outline"
  ),
  conditional(
    [
      "border-none *:data-[slot=bubble-content]:rounded-none *:data-[slot=bubble-content]:bg-transparent *:data-[slot=bubble-content]:p-0 [&>[data-slot=bubble-content]:is(button,a):hover]:bg-muted [&>[data-slot=bubble-content]:is(button,a):hover]:text-foreground dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-muted/50",
    ],
    ({ $variant }) => $variant === "ghost"
  ),
  conditional(
    [
      "*:data-[slot=bubble-content]:bg-destructive/10 *:data-[slot=bubble-content]:text-destructive dark:*:data-[slot=bubble-content]:bg-destructive/20 [&>[data-slot=bubble-content]:is(button,a):hover]:bg-destructive/20 dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-destructive/30",
    ],
    ({ $variant }) => $variant === "destructive"
  ),
])

function Bubble({
  variant = "default",
  align = "start",
  className,
  ...props
}: React.ComponentProps<"div"> & {
  align?: "start" | "end"
  variant?: BubbleVariant
}) {
  return (
    <div
      data-slot="bubble"
      data-variant={variant}
      data-align={align}
      className={composeClasses(
        BubbleBase.toClass({ $variant: variant }),
        className
      )}
      {...props}
    />
  )
}

const bubbleContentClasses = compose.div(() => [
  "w-fit max-w-full min-w-0 overflow-hidden rounded-none border border-transparent px-4 py-3 text-sm leading-relaxed wrap-break-word group-data-[align=end]/bubble:self-end [button]:text-left [button,a]:transition-colors [button,a]:outline-none [button,a]:focus-visible:border-ring [button,a]:focus-visible:ring-2 [button,a]:focus-visible:ring-ring/30",
])

function BubbleContent({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: composeClasses(bubbleContentClasses.toClass(), className),
      },
      props
    ),
    render,
    state: {
      slot: "bubble-content",
    },
  })
}

type BubbleReactionsSide = "top" | "bottom"
type BubbleReactionsAlign = "start" | "end"

const BubbleReactionsBase = compose.div<{
  $side: BubbleReactionsSide
  $align: BubbleReactionsAlign
}>((conditional) => [
  "absolute z-10 flex w-fit shrink-0 items-center justify-center gap-1 rounded-none bg-muted px-2 py-0.5 text-sm ring-3 ring-card has-[button]:p-0",
  conditional(["top-0 -translate-y-3/4"], ({ $side }) => $side === "top"),
  conditional(["bottom-0 translate-y-3/4"], ({ $side }) => $side === "bottom"),
  conditional(["left-3"], ({ $align }) => $align === "start"),
  conditional(["right-3"], ({ $align }) => $align === "end"),
])

function BubbleReactions({
  side = "bottom",
  align = "end",
  className,
  ...props
}: React.ComponentProps<"div"> & {
  align?: BubbleReactionsAlign
  side?: BubbleReactionsSide
}) {
  return (
    <div
      data-slot="bubble-reactions"
      data-align={align}
      data-side={side}
      className={composeClasses(
        BubbleReactionsBase.toClass({ $side: side, $align: align }),
        className
      )}
      {...props}
    />
  )
}

export { BubbleGroup, Bubble, BubbleContent, BubbleReactions }
