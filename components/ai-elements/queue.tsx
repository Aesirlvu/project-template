"use client"

import * as React from "react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"
import { IconPaperclip } from "@tabler/icons-react"

export interface QueueMessagePart {
  type: string
  text?: string
  url?: string
  filename?: string
  mediaType?: string
}

export interface QueueMessage {
  id: string
  parts: QueueMessagePart[]
}

export interface QueueTodo {
  id: string
  title: string
  description?: string
  status?: "pending" | "completed"
}

export type QueueProps = React.ComponentProps<"div">

/**
 * The agent's todo list, split into what is left and what is done.
 */
function Queue({ className, ...props }: QueueProps) {
  return <Trace className={cn(className)} {...props} />
}

export type QueueSectionProps = {
  className?: string
  children?: React.ReactNode
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

/**
 * A section of the queue, like "2 to do" or "1 completed".
 */
function QueueSection({
  className,
  defaultOpen = true,
  open,
  onOpenChange,
  children,
}: QueueSectionProps) {
  const collapsibleProps: React.ComponentProps<typeof TraceCollapsible> =
    open === undefined
      ? { defaultOpen, onOpenChange }
      : { open, onOpenChange: onOpenChange ?? (() => undefined) }

  return (
    <TraceCollapsible className={cn(className)} {...collapsibleProps}>
      {children}
    </TraceCollapsible>
  )
}

export type QueueSectionTriggerProps = React.ComponentProps<
  typeof TraceCollapsibleTrigger
>

/**
 * The line of a section. It opens and closes the items.
 */
function QueueSectionTrigger({
  className,
  children,
  ...props
}: QueueSectionTriggerProps) {
  return (
    <TraceCollapsibleTrigger className={cn(className)} {...props}>
      {children}
    </TraceCollapsibleTrigger>
  )
}

export type QueueSectionLabelProps = React.ComponentProps<"span"> & {
  count?: number
  label: string
  icon?: React.ReactNode
}

/**
 * The label of a section, like "2 to do".
 */
function QueueSectionLabel({
  count,
  label,
  icon,
  className,
  ...props
}: QueueSectionLabelProps) {
  return (
    <TraceLine className={cn(className)} {...props}>
      {icon ? <TraceIcon>{icon}</TraceIcon> : null}
      <TraceTitle>
        {count === undefined ? label : `${count} ${label}`}
      </TraceTitle>
    </TraceLine>
  )
}

export type QueueSectionContentProps = React.ComponentProps<
  typeof TraceCollapsibleContent
>

/**
 * The items of a section.
 */
function QueueSectionContent({
  className,
  children,
  ...props
}: QueueSectionContentProps) {
  return (
    <TraceCollapsibleContent className={cn(className)} {...props}>
      {children}
    </TraceCollapsibleContent>
  )
}

export type QueueListProps = React.ComponentProps<"div">

/**
 * The list of items.
 */
function QueueList({ className, children, ...props }: QueueListProps) {
  return (
    <Trace className={cn(className)} {...props}>
      {children}
    </Trace>
  )
}

export type QueueItemProps = React.ComponentProps<typeof TraceLine>

/**
 * One item of the queue.
 */
function QueueItem({ className, children, ...props }: QueueItemProps) {
  return (
    <TraceLine className={cn("group", className)} {...props}>
      {children}
    </TraceLine>
  )
}

export type QueueItemIndicatorProps = React.ComponentProps<typeof TraceIcon> & {
  completed?: boolean
}

/**
 * The dot that shows the status of an item.
 */
function QueueItemIndicator({
  completed = false,
  className,
  children,
  ...props
}: QueueItemIndicatorProps) {
  return (
    <TraceIcon className={cn(className)} {...props}>
      {children ?? (
        <span
          className={cn(
            "size-2.5 rounded-full border",
            completed
              ? "border-muted-foreground/20 bg-muted-foreground/10"
              : "border-muted-foreground/50"
          )}
        />
      )}
    </TraceIcon>
  )
}

export type QueueItemContentProps = React.ComponentProps<typeof TraceTitle> & {
  completed?: boolean
}

/**
 * The title of an item.
 */
function QueueItemContent({
  completed = false,
  className,
  children,
  ...props
}: QueueItemContentProps) {
  return (
    <TraceTitle
      className={cn(
        completed
          ? "text-muted-foreground/50 line-through"
          : "text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </TraceTitle>
  )
}

export type QueueItemDescriptionProps = React.ComponentProps<
  typeof TraceDescription
> & {
  completed?: boolean
}

/**
 * The description of an item.
 */
function QueueItemDescription({
  completed = false,
  className,
  children,
  ...props
}: QueueItemDescriptionProps) {
  return (
    <TraceDescription
      className={cn(
        completed
          ? "text-muted-foreground/40 line-through"
          : "text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </TraceDescription>
  )
}

export type QueueItemActionsProps = React.ComponentProps<"div">

/**
 * The actions of an item.
 */
function QueueItemActions({ className, ...props }: QueueItemActionsProps) {
  return <div className={cn("flex gap-1", className)} {...props} />
}

export type QueueItemActionProps = Omit<
  React.ComponentProps<typeof Button>,
  "variant" | "size"
>

/**
 * One action of an item. Label an icon only action with `aria-label`.
 */
function QueueItemAction({ className, ...props }: QueueItemActionProps) {
  return (
    <Button
      className={cn(
        "size-auto rounded p-1 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-muted-foreground/10 hover:text-foreground",
        className
      )}
      size="icon-xs"
      type="button"
      variant="ghost"
      {...props}
    />
  )
}

export type QueueItemAttachmentProps = React.ComponentProps<"div">

/**
 * The attachments of an item.
 */
function QueueItemAttachment({
  className,
  ...props
}: QueueItemAttachmentProps) {
  return (
    <div className={cn("mt-1 flex flex-wrap gap-2", className)} {...props} />
  )
}

export type QueueItemImageProps = React.ComponentProps<"img">

/**
 * One image attached to an item.
 */
function QueueItemImage({ className, ...props }: QueueItemImageProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt=""
      className={cn("h-8 w-8 rounded border object-cover", className)}
      height={32}
      width={32}
      {...props}
    />
  )
}

export type QueueItemFileProps = React.ComponentProps<"span">

/**
 * One file attached to an item.
 */
function QueueItemFile({ className, children, ...props }: QueueItemFileProps) {
  return (
    <span
      className={cn(
        "flex items-center gap-1 rounded border bg-muted px-2 py-1 text-xs",
        className
      )}
      {...props}
    >
      <IconPaperclip aria-hidden="true" size={12} />
      <span className="max-w-[100px] truncate">{children}</span>
    </span>
  )
}

export {
  Queue,
  QueueSection,
  QueueSectionTrigger,
  QueueSectionLabel,
  QueueSectionContent,
  QueueList,
  QueueItem,
  QueueItemIndicator,
  QueueItemContent,
  QueueItemDescription,
  QueueItemActions,
  QueueItemAction,
  QueueItemAttachment,
  QueueItemImage,
  QueueItemFile,
}
