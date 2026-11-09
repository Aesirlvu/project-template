import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { Button } from "@/components/ui/button"

import { compose, composeClasses } from "@/lib/compose-raw"

type AttachmentSize = "default" | "sm" | "xs"
type AttachmentOrientation = "horizontal" | "vertical"

const AttachmentBase = compose.div<{
  $size: AttachmentSize
  $orientation: AttachmentOrientation
}>((conditional) => [
  "group/attachment relative flex w-fit max-w-full min-w-0 shrink-0 flex-wrap rounded-none border bg-card text-card-foreground transition-colors focus-within:ring-1 focus-within:ring-ring/30 has-[>a,>button]:hover:bg-muted/50 data-[state=error]:border-destructive/30 data-[state=idle]:border-dashed",
  conditional(
    [
      "gap-2 text-sm has-data-[slot=attachment-content]:px-3 has-data-[slot=attachment-content]:py-2.5 has-data-[slot=attachment-media]:p-2.5",
    ],
    ({ $size }) => $size === "default"
  ),
  conditional(
    [
      "gap-2.5 text-xs has-data-[slot=attachment-content]:px-2.5 has-data-[slot=attachment-content]:py-2 has-data-[slot=attachment-media]:p-2",
    ],
    ({ $size }) => $size === "sm"
  ),
  conditional(
    [
      "gap-1.5 rounded-none text-xs has-data-[slot=attachment-content]:px-2 has-data-[slot=attachment-content]:py-1.5 has-data-[slot=attachment-media]:p-1.5",
    ],
    ({ $size }) => $size === "xs"
  ),
  conditional(
    ["min-w-40 items-center"],
    ({ $orientation }) => $orientation === "horizontal"
  ),
  conditional(
    ["w-24 flex-col has-data-[slot=attachment-content]:w-30"],
    ({ $orientation }) => $orientation === "vertical"
  ),
])

function Attachment({
  className,
  state = "done",
  size = "default",
  orientation = "horizontal",
  ...props
}: React.ComponentProps<"div"> & {
  state?: "idle" | "uploading" | "processing" | "error" | "done"
  size?: AttachmentSize
  orientation?: AttachmentOrientation
}) {
  return (
    <AttachmentBase
      data-slot="attachment"
      data-state={state}
      data-size={size}
      data-orientation={orientation}
      $size={size}
      $orientation={orientation}
      className={composeClasses(
        AttachmentBase.toClass({ $size: size, $orientation: orientation }),
        className
      )}
      {...props}
    />
  )
}

type AttachmentMediaVariant = "icon" | "image"

const AttachmentMediaBase = compose.div<{ $variant: AttachmentMediaVariant }>(
  (conditional) => [
    "relative flex aspect-square w-10 shrink-0 items-center justify-center overflow-hidden rounded-none bg-muted text-foreground group-data-[orientation=vertical]/attachment:w-full group-data-[size=sm]/attachment:w-8 group-data-[size=xs]/attachment:w-7 group-data-[size=xs]/attachment:rounded-none group-data-[state=error]/attachment:bg-destructive/10 group-data-[state=error]/attachment:text-destructive group-data-[orientation=vertical]/attachment:*:data-[slot=spinner]:size-6! [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 group-data-[orientation=vertical]/attachment:[&_svg:not([class*='size-'])]:size-6 group-data-[size=xs]/attachment:[&_svg:not([class*='size-'])]:size-3.5",
    conditional(
      [
        "opacity-60 group-data-[state=done]/attachment:opacity-100 group-data-[state=idle]/attachment:opacity-100 *:[img]:aspect-square *:[img]:w-full *:[img]:object-cover",
      ],
      ({ $variant }) => $variant === "image"
    ),
  ]
)

function AttachmentMedia({
  className,
  variant = "icon",
  ...props
}: React.ComponentProps<"div"> & { variant?: AttachmentMediaVariant }) {
  return (
    <AttachmentMediaBase
      data-slot="attachment-media"
      data-variant={variant}
      $variant={variant}
      className={composeClasses(
        AttachmentMediaBase.toClass({ $variant: variant }),
        className
      )}
      {...props}
    />
  )
}

const attachmentContentClasses = compose.div(() => [
  "max-w-full min-w-0 flex-1 leading-tight group-data-[orientation=vertical]/attachment:px-1",
])

function AttachmentContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-content"
      className={composeClasses(attachmentContentClasses.toClass(), className)}
      {...props}
    />
  )
}

const attachmentTitleClasses = compose.div(() => [
  "block max-w-full min-w-0 truncate font-medium group-data-[state=processing]/attachment:shimmer group-data-[state=uploading]/attachment:shimmer",
])

function AttachmentTitle({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="attachment-title"
      className={composeClasses(attachmentTitleClasses.toClass(), className)}
      {...props}
    />
  )
}

const attachmentDescriptionClasses = compose.div(() => [
  "mt-0.5 block min-w-0 truncate text-xs text-muted-foreground group-data-[state=error]/attachment:text-destructive/80",
  "max-w-full",
])

function AttachmentDescription({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="attachment-description"
      className={composeClasses(
        attachmentDescriptionClasses.toClass(),
        className
      )}
      {...props}
    />
  )
}

const attachmentActionsClasses = compose.div(() => [
  "relative z-20 flex shrink-0 items-center group-data-[orientation=vertical]/attachment:absolute group-data-[orientation=vertical]/attachment:top-3 group-data-[orientation=vertical]/attachment:right-3 group-data-[orientation=vertical]/attachment:gap-1",
])

function AttachmentActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-actions"
      className={composeClasses(attachmentActionsClasses.toClass(), className)}
      {...props}
    />
  )
}

function AttachmentAction({
  className,
  variant,
  size = "icon-xs",
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      data-slot="attachment-action"
      variant={variant ?? "ghost"}
      size={size}
      className={className}
      {...props}
    />
  )
}

function AttachmentTrigger({
  className,
  render,
  type,
  ...props
}: useRender.ComponentProps<"button">) {
  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        type: render ? type : (type ?? "button"),
        className: composeClasses(
          compose.div(() => ["absolute inset-0 z-10 outline-none"]).toClass(),
          className
        ),
      },
      props
    ),
    render,
    state: {
      slot: "attachment-trigger",
    },
  })
}

const attachmentGroupClasses = compose.div(() => [
  "flex min-w-0 scroll-fade-x snap-x snap-mandatory scroll-px-1 scrollbar-none gap-3 overflow-x-auto overscroll-x-contain py-1 *:data-[slot=attachment]:flex-none *:data-[slot=attachment]:snap-start",
])

function AttachmentGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-group"
      className={composeClasses(attachmentGroupClasses.toClass(), className)}
      {...props}
    />
  )
}

export {
  Attachment,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentContent,
  AttachmentTitle,
  AttachmentDescription,
  AttachmentActions,
  AttachmentAction,
  AttachmentTrigger,
}
