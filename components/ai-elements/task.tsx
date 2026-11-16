"use client"

import * as React from "react"
import { cn } from "cn"

import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"
import { IconSearch } from "@tabler/icons-react"

export type TaskProps = React.ComponentProps<"div"> & {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

/**
 * A piece of work the agent is doing, with the steps it takes.
 */
function Task({
  className,
  defaultOpen = true,
  open,
  onOpenChange,
  children,
  ...props
}: TaskProps) {
  const collapsibleProps: React.ComponentProps<typeof TraceCollapsible> =
    open === undefined
      ? { defaultOpen, onOpenChange }
      : { open, onOpenChange: onOpenChange ?? (() => undefined) }

  return (
    <Trace className={cn(className)} {...props}>
      <TraceCollapsible {...collapsibleProps}>{children}</TraceCollapsible>
    </Trace>
  )
}

export type TaskTriggerProps = React.ComponentProps<
  typeof TraceCollapsibleTrigger
> & {
  title: string
}

/**
 * The line of the task. It opens and closes the steps.
 */
function TaskTrigger({
  className,
  children,
  title,
  ...props
}: TaskTriggerProps) {
  return (
    <TraceCollapsibleTrigger className={cn(className)} {...props}>
      {children ?? (
        <TraceLine>
          <TraceIcon>
            <IconSearch />
          </TraceIcon>
          <TraceTitle>{title}</TraceTitle>
        </TraceLine>
      )}
    </TraceCollapsibleTrigger>
  )
}

export type TaskContentProps = React.ComponentProps<
  typeof TraceCollapsibleContent
>

/**
 * The steps of the task. They keep their open state when the task closes.
 */
function TaskContent({ className, children, ...props }: TaskContentProps) {
  return (
    <TraceCollapsibleContent keepMounted className={cn(className)} {...props}>
      <Trace>{children}</Trace>
    </TraceCollapsibleContent>
  )
}

export type TaskItemProps = React.ComponentProps<typeof TraceLine>

/**
 * One step of the task.
 */
function TaskItem({ className, children, ...props }: TaskItemProps) {
  return (
    <TraceLine className={cn(className)} {...props}>
      <TraceTitle>{children}</TraceTitle>
    </TraceLine>
  )
}

export type TaskItemFileProps = React.ComponentProps<"div">

/**
 * A file a step touched.
 */
function TaskItemFile({ className, children, ...props }: TaskItemFileProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-md border bg-secondary px-1.5 py-0.5 text-xs text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { Task, TaskTrigger, TaskContent, TaskItem, TaskItemFile }
