"use client"

import * as React from "react"

import {
  compose,
  composeClasses,
  composeClassesWithState,
} from "@/lib/compose-raw"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const inputGroupClasses = compose.div(() => [
  "group/input-group relative flex h-10 w-full min-w-0 items-center rounded-none border border-transparent border-b-input bg-transparent transition-[color,border-color] outline-none in-data-[slot=combobox-content]:focus-within:border-inherit in-data-[slot=combobox-content]:focus-within:ring-0 has-data-[align=block-end]:rounded-none has-data-[align=block-start]:rounded-none has-[[data-slot=input-group-control]:focus-visible]:border-b-ring has-[[data-slot][aria-invalid=true]]:border-b-destructive has-[textarea]:rounded-none has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>textarea]:h-auto dark:has-[[data-slot][aria-invalid=true]]:border-b-destructive/50 has-[>[data-align=block-end]]:[&>input]:pt-3 has-[>[data-align=block-start]]:[&>input]:pb-3",
])

function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={composeClasses(inputGroupClasses.toClass(), className)}
      {...props}
    />
  )
}

type InputGroupAlign =
  "inline-start" | "inline-end" | "block-start" | "block-end"

const InputGroupAddonBase = compose.div<{ $align: InputGroupAlign }>(
  (conditional) => [
    "flex h-auto cursor-text items-center justify-center gap-2 py-2 text-sm font-medium text-muted-foreground select-none group-data-[disabled=true]/input-group:opacity-50 **:data-[slot=kbd]:rounded-none **:data-[slot=kbd]:bg-muted-foreground/10 **:data-[slot=kbd]:px-1.5 [&>svg:not([class*='size-'])]:size-3.5",
    conditional(["order-first"], ({ $align }) => $align === "inline-start"),
    conditional(["order-last"], ({ $align }) => $align === "inline-end"),
    conditional(
      [
        "order-first w-full justify-start pt-3 group-has-[>input]/input-group:pt-3.5 [.border-b]:pb-3.5",
      ],
      ({ $align }) => $align === "block-start"
    ),
    conditional(
      [
        "order-last w-full justify-start pb-3 group-has-[>input]/input-group:pb-3.5 [.border-t]:pt-3.5",
      ],
      ({ $align }) => $align === "block-end"
    ),
  ]
)

function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: React.ComponentProps<"div"> & { align?: InputGroupAlign }) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        if ((e.target as HTMLElement).closest("button")) {
          return
        }
        e.currentTarget.parentElement?.querySelector("input")?.focus()
      }}
      className={composeClasses(
        InputGroupAddonBase.toClass({ $align: align }),
        className
      )}
      {...props}
    />
  )
}

type InputGroupButtonSize = "xs" | "sm" | "icon-xs" | "icon-sm"

const InputGroupButtonBase = compose.div<{ $size: InputGroupButtonSize }>(
  (conditional) => [
    "flex items-center gap-2 rounded-none text-sm shadow-none",
    conditional(
      [
        "h-6 gap-1 rounded-none px-1.5 text-xs [&>svg:not([class*='size-'])]:size-3.5",
      ],
      ({ $size }) => $size === "xs"
    ),
    conditional([""], ({ $size }) => $size === "sm"),
    conditional(
      ["size-6 p-0 text-xs has-[>svg]:p-0"],
      ({ $size }) => $size === "icon-xs"
    ),
    conditional(
      ["size-8 p-0 has-[>svg]:p-0"],
      ({ $size }) => $size === "icon-sm"
    ),
  ]
)

function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size" | "type"> & {
  size?: InputGroupButtonSize
  type?: "button" | "submit" | "reset"
}) {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      className={composeClassesWithState(
        InputGroupButtonBase.toClass({ $size: size }),
        className
      )}
      {...props}
    />
  )
}

const inputGroupTextClasses = compose.span(() => [
  "flex items-center gap-2 text-sm text-muted-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-3.5",
])

function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={composeClasses(inputGroupTextClasses.toClass(), className)}
      {...props}
    />
  )
}

const inputGroupInputClasses = compose.div(() => [
  "flex-1 border-0 bg-transparent ring-0 group-has-[>[data-align=inline-end]]/input-group:pr-2 group-has-[>[data-align=inline-start]]/input-group:pl-2 focus-visible:ring-0 aria-invalid:ring-0 dark:bg-transparent",
])

function InputGroupInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <Input
      data-slot="input-group-control"
      className={composeClasses(inputGroupInputClasses.toClass(), className)}
      {...props}
    />
  )
}

const inputGroupTextareaClasses = compose.div(() => [
  "flex-1 resize-none border-0 bg-transparent py-2.5 ring-0 focus-visible:ring-0 aria-invalid:ring-0 dark:bg-transparent",
])

function InputGroupTextarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={composeClasses(inputGroupTextareaClasses.toClass(), className)}
      {...props}
    />
  )
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
}
