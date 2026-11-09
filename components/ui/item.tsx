import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import {
  compose,
  composeClasses,
  composeClassesWithState,
} from "@/lib/compose-raw"

import { Separator } from "@/components/ui/separator"

const itemGroupClasses = compose.div(() => [
  "group/item-group flex w-full flex-col gap-4 has-data-[size=sm]:gap-2.5 has-data-[size=xs]:gap-2",
])

function ItemGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="list"
      data-slot="item-group"
      className={composeClasses(itemGroupClasses.toClass(), className)}
      {...props}
    />
  )
}

const itemSeparatorClasses = compose.div(() => ["my-2"])

function ItemSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="item-separator"
      orientation="horizontal"
      className={composeClassesWithState(
        itemSeparatorClasses.toClass(),
        className
      )}
      {...props}
    />
  )
}

type ItemVariant = "default" | "outline" | "muted"
type ItemSize = "default" | "sm" | "xs"

const ItemBase = compose.div<{ $variant: ItemVariant; $size: ItemSize }>(
  (conditional) => [
    "group/item flex w-full flex-wrap items-center rounded-none border text-sm transition-colors duration-100 outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 [a]:transition-colors [a]:hover:bg-muted",
    conditional(
      ["border-transparent"],
      ({ $variant }) => $variant === "default"
    ),
    conditional(["border-border"], ({ $variant }) => $variant === "outline"),
    conditional(
      ["border-transparent bg-muted/50"],
      ({ $variant }) => $variant === "muted"
    ),
    conditional(["gap-3.5 px-4 py-3.5"], ({ $size }) => $size === "default"),
    conditional(["gap-3.5 px-3.5 py-3"], ({ $size }) => $size === "sm"),
    conditional(
      ["gap-2.5 px-3 py-2.5 in-data-[slot=dropdown-menu-content]:p-0"],
      ({ $size }) => $size === "xs"
    ),
  ]
)

function Item({
  className,
  variant = "default",
  size = "default",
  render,
  ...props
}: useRender.ComponentProps<"div"> & {
  variant?: ItemVariant
  size?: ItemSize
}) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: composeClasses(
          ItemBase.toClass({ $variant: variant, $size: size }),
          className
        ),
      },
      props
    ),
    render,
    state: {
      slot: "item",
      variant,
      size,
    },
  })
}

type ItemMediaVariant = "default" | "icon" | "image"

const ItemMediaBase = compose.div<{ $variant: ItemMediaVariant }>(
  (conditional) => [
    "flex shrink-0 items-center justify-center gap-2 group-has-data-[slot=item-description]/item:translate-y-0.5 group-has-data-[slot=item-description]/item:self-start [&_svg]:pointer-events-none",
    conditional(["bg-transparent"], ({ $variant }) => $variant === "default"),
    conditional(
      ["[&_svg:not([class*='size-'])]:size-4"],
      ({ $variant }) => $variant === "icon"
    ),
    conditional(
      [
        "size-10 overflow-hidden rounded-none group-data-[size=sm]/item:size-8 group-data-[size=xs]/item:size-6 group-data-[size=xs]/item:rounded-none [&_img]:size-full [&_img]:object-cover",
      ],
      ({ $variant }) => $variant === "image"
    ),
  ]
)

function ItemMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & { variant?: ItemMediaVariant }) {
  return (
    <div
      data-slot="item-media"
      data-variant={variant}
      className={composeClasses(
        ItemMediaBase.toClass({ $variant: variant }),
        className
      )}
      {...props}
    />
  )
}

const itemContentClasses = compose.div(() => [
  "flex flex-1 flex-col gap-1 group-data-[size=xs]/item:gap-0.5 [&+[data-slot=item-content]]:flex-none",
])

function ItemContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-content"
      className={composeClasses(itemContentClasses.toClass(), className)}
      {...props}
    />
  )
}

const itemTitleClasses = compose.div(() => [
  "line-clamp-1 flex w-fit items-center gap-2 text-xs leading-snug font-semibold uppercase underline-offset-4",
])

function ItemTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-title"
      className={composeClasses(itemTitleClasses.toClass(), className)}
      {...props}
    />
  )
}

const itemDescriptionClasses = compose.div(() => [
  "line-clamp-2 text-left text-sm leading-relaxed font-normal text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
])

function ItemDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="item-description"
      className={composeClasses(itemDescriptionClasses.toClass(), className)}
      {...props}
    />
  )
}

const itemActionsClasses = compose.div(() => ["flex items-center gap-2"])

function ItemActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-actions"
      className={composeClasses(itemActionsClasses.toClass(), className)}
      {...props}
    />
  )
}

const itemHeaderClasses = compose.div(() => [
  "flex basis-full items-center justify-between gap-2",
])

function ItemHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-header"
      className={composeClasses(itemHeaderClasses.toClass(), className)}
      {...props}
    />
  )
}

const itemFooterClasses = compose.div(() => [
  "flex basis-full items-center justify-between gap-2",
])

function ItemFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-footer"
      className={composeClasses(itemFooterClasses.toClass(), className)}
      {...props}
    />
  )
}

export {
  Item,
  ItemMedia,
  ItemContent,
  ItemActions,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
  ItemDescription,
  ItemHeader,
  ItemFooter,
}
