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
import { IconBook, IconWorld } from "@tabler/icons-react"

export type SourcesProps = React.ComponentProps<"div"> & {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

/**
 * The links the agent used for a reply.
 */
function Sources({
  className,
  open,
  defaultOpen,
  onOpenChange,
  children,
  ...props
}: SourcesProps) {
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

export type SourcesTriggerProps = React.ComponentProps<
  typeof TraceCollapsibleTrigger
> & {
  count: number
}

/**
 * The line that says how many sources there are. It opens and closes the list.
 */
function SourcesTrigger({
  className,
  count,
  children,
  ...props
}: SourcesTriggerProps) {
  return (
    <TraceCollapsibleTrigger className={cn(className)} {...props}>
      {children ?? (
        <TraceLine>
          <TraceIcon>
            <IconWorld />
          </TraceIcon>
          <TraceTitle>Used {count} sources</TraceTitle>
        </TraceLine>
      )}
    </TraceCollapsibleTrigger>
  )
}

export type SourcesContentProps = React.ComponentProps<
  typeof TraceCollapsibleContent
>

/**
 * The list of sources.
 */
function SourcesContent({
  className,
  children,
  ...props
}: SourcesContentProps) {
  return (
    <TraceCollapsibleContent className={cn(className)} {...props}>
      <Trace>{children}</Trace>
    </TraceCollapsibleContent>
  )
}

export type SourceProps = React.ComponentProps<"a">

/**
 * One source. It opens in a new tab.
 */
function Source({ className, href, title, children, ...props }: SourceProps) {
  return (
    <a
      className={cn("flex items-center gap-2", className)}
      href={href}
      rel="noreferrer"
      target="_blank"
      {...props}
    >
      {children ?? (
        <TraceLine>
          <TraceIcon>
            <IconBook />
          </TraceIcon>
          <TraceTitle>
            {title}
            <span className="sr-only"> (opens in a new tab)</span>
          </TraceTitle>
        </TraceLine>
      )}
    </a>
  )
}

export { Sources, SourcesTrigger, SourcesContent, Source }
