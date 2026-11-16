"use client"

import * as React from "react"
import { cn } from "cn"

import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
} from "@/components/ui/command"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

/**
 * Tracks whether the current subtree already lives inside a radio group.
 *
 * Base UI throws when a radio item is rendered outside one, so a standalone
 * item gets a group of its own instead of crashing.
 */
const ModelSelectorListContext = React.createContext(false)

export type ModelSelectorProps = React.ComponentProps<typeof DropdownMenu>

export function ModelSelector(props: ModelSelectorProps) {
  return <DropdownMenu {...props} />
}

export type ModelSelectorTriggerProps = React.ComponentProps<
  typeof DropdownMenuTrigger
>

export function ModelSelectorTrigger(props: ModelSelectorTriggerProps) {
  return <DropdownMenuTrigger {...props} />
}

export type ModelSelectorContentProps = React.ComponentProps<
  typeof DropdownMenuContent
> & {
  title?: React.ReactNode
}

export function ModelSelectorContent({
  className,
  children,
  title = "Model Selector",
  ...props
}: ModelSelectorContentProps) {
  return (
    <DropdownMenuContent className={cn("w-56", className)} {...props}>
      <span className="sr-only">{title}</span>
      {children}
    </DropdownMenuContent>
  )
}

export type ModelSelectorDialogProps = React.ComponentProps<
  typeof CommandDialog
>

export function ModelSelectorDialog(props: ModelSelectorDialogProps) {
  return <CommandDialog {...props} />
}

export type ModelSelectorInputProps = React.ComponentProps<typeof CommandInput>

export function ModelSelectorInput(props: ModelSelectorInputProps) {
  return <CommandInput {...props} />
}

export type ModelSelectorListProps = React.ComponentProps<
  typeof DropdownMenuRadioGroup
>

export function ModelSelectorList({
  className,
  children,
  ...props
}: ModelSelectorListProps) {
  return (
    <ModelSelectorListContext.Provider value={true}>
      <DropdownMenuRadioGroup className={className} {...props}>
        {children}
      </DropdownMenuRadioGroup>
    </ModelSelectorListContext.Provider>
  )
}

export type ModelSelectorEmptyProps = React.ComponentProps<typeof CommandEmpty>

export function ModelSelectorEmpty(props: ModelSelectorEmptyProps) {
  return <CommandEmpty {...props} />
}

export type ModelSelectorGroupProps = React.ComponentProps<
  typeof DropdownMenuGroup
> & {
  heading?: React.ReactNode
}

export function ModelSelectorGroup({
  className,
  children,
  heading,
  ...props
}: ModelSelectorGroupProps) {
  return (
    <DropdownMenuGroup className={className} {...props}>
      {heading ? <DropdownMenuLabel>{heading}</DropdownMenuLabel> : null}
      {children}
    </DropdownMenuGroup>
  )
}

export type ModelSelectorItemProps = React.ComponentProps<
  typeof DropdownMenuRadioItem
>

export function ModelSelectorItem({
  className,
  children,
  ...props
}: ModelSelectorItemProps) {
  const inList = React.useContext(ModelSelectorListContext)

  const item = (
    <DropdownMenuRadioItem className={className} closeOnClick {...props}>
      {children}
    </DropdownMenuRadioItem>
  )

  if (inList) {
    return item
  }

  return <DropdownMenuRadioGroup>{item}</DropdownMenuRadioGroup>
}

export type ModelSelectorShortcutProps = React.ComponentProps<
  typeof DropdownMenuShortcut
>

export function ModelSelectorShortcut(props: ModelSelectorShortcutProps) {
  return <DropdownMenuShortcut {...props} />
}

export type ModelSelectorSeparatorProps = React.ComponentProps<
  typeof DropdownMenuSeparator
>

export function ModelSelectorSeparator(props: ModelSelectorSeparatorProps) {
  return <DropdownMenuSeparator {...props} />
}

export type ModelSelectorLogoProps = Omit<
  React.ComponentProps<"img">,
  "src" | "alt"
> & {
  provider: string
}

export function ModelSelectorLogo({
  provider,
  className,
  ...props
}: ModelSelectorLogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      alt={`${provider} logo`}
      className={cn("size-3 dark:invert", className)}
      height={12}
      src={`https://models.dev/logos/${provider}.svg`}
      width={12}
    />
  )
}

export type ModelSelectorLogoGroupProps = React.ComponentProps<"div">

export function ModelSelectorLogoGroup({
  className,
  ...props
}: ModelSelectorLogoGroupProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center -space-x-1 [&>img]:rounded-full [&>img]:bg-background [&>img]:p-px [&>img]:ring-1 dark:[&>img]:bg-foreground",
        className
      )}
      {...props}
    />
  )
}

export type ModelSelectorNameProps = React.ComponentProps<"span">

export function ModelSelectorName({
  className,
  ...props
}: ModelSelectorNameProps) {
  return (
    <span className={cn("flex-1 truncate text-left", className)} {...props} />
  )
}
