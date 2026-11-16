"use client"

import * as React from "react"
import { cn } from "cn"

import { Badge } from "@/components/ui/badge"
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
import { IconBrain, IconPoint, type TablerIcon } from "@tabler/icons-react"

export type ChainOfThoughtProps = React.ComponentProps<"div"> & {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

/**
 * A summary line that expands into the steps an agent took.
 */
function ChainOfThought({
  className,
  open,
  defaultOpen,
  onOpenChange,
  children,
  ...props
}: ChainOfThoughtProps) {
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

export type ChainOfThoughtHeaderProps = React.ComponentProps<
  typeof TraceCollapsibleTrigger
>

/**
 * The summary line. It opens and closes the steps.
 */
function ChainOfThoughtHeader({
  className,
  children,
  ...props
}: ChainOfThoughtHeaderProps) {
  return (
    <TraceCollapsibleTrigger className={cn(className)} {...props}>
      <TraceLine>
        <TraceIcon>
          <IconBrain />
        </TraceIcon>
        <TraceTitle>{children ?? "Chain of Thought"}</TraceTitle>
      </TraceLine>
    </TraceCollapsibleTrigger>
  )
}

export type ChainOfThoughtContentProps = React.ComponentProps<
  typeof TraceCollapsibleContent
>

/**
 * The steps. They keep their open state when the summary closes.
 */
function ChainOfThoughtContent({
  className,
  children,
  ...props
}: ChainOfThoughtContentProps) {
  return (
    <TraceCollapsibleContent keepMounted className={cn(className)} {...props}>
      <Trace>{children}</Trace>
    </TraceCollapsibleContent>
  )
}

export type ChainOfThoughtStepStatus = "complete" | "active" | "pending"

export type ChainOfThoughtStepProps = Omit<
  React.ComponentProps<typeof TraceLine>,
  "status"
> & {
  icon?: TablerIcon
  label: React.ReactNode
  description?: React.ReactNode
  status?: ChainOfThoughtStepStatus
}

const STEP_STATUS: Record<
  ChainOfThoughtStepStatus,
  React.ComponentProps<typeof TraceLine>["status"]
> = {
  active: "running",
  pending: "pending",
  complete: undefined,
}

/**
 * One step of the chain.
 */
function ChainOfThoughtStep({
  className,
  icon: Icon = IconPoint,
  label,
  description,
  status = "complete",
  children,
  ...props
}: ChainOfThoughtStepProps) {
  return (
    <TraceLine
      className={cn(className)}
      status={STEP_STATUS[status]}
      {...props}
    >
      <TraceIcon>
        <Icon />
      </TraceIcon>
      <TraceTitle>{label}</TraceTitle>
      {description ? <TraceDescription>{description}</TraceDescription> : null}
      {children}
    </TraceLine>
  )
}

export type ChainOfThoughtSearchResultsProps = React.ComponentProps<"div">

/**
 * The list of results a step found.
 */
function ChainOfThoughtSearchResults({
  className,
  ...props
}: ChainOfThoughtSearchResultsProps) {
  return (
    <div
      className={cn("flex flex-wrap items-center gap-2", className)}
      {...props}
    />
  )
}

export type ChainOfThoughtSearchResultProps = React.ComponentProps<typeof Badge>

/**
 * One result of a step.
 */
function ChainOfThoughtSearchResult({
  className,
  children,
  ...props
}: ChainOfThoughtSearchResultProps) {
  return (
    <Badge
      className={cn("gap-1 px-2 py-0.5 text-xs font-normal", className)}
      variant="secondary"
      {...props}
    >
      {children}
    </Badge>
  )
}

export type ChainOfThoughtImageProps = React.ComponentProps<"div"> & {
  caption?: string
}

/**
 * An image a step produced.
 */
function ChainOfThoughtImage({
  className,
  children,
  caption,
  ...props
}: ChainOfThoughtImageProps) {
  return (
    <div className={cn("mt-2 space-y-2", className)} {...props}>
      <div className="relative flex max-h-[22rem] items-center justify-center overflow-hidden rounded-lg bg-muted p-3">
        {children}
      </div>
      {caption ? (
        <p className="text-xs text-muted-foreground">{caption}</p>
      ) : null}
    </div>
  )
}

export {
  ChainOfThought,
  ChainOfThoughtHeader,
  ChainOfThoughtContent,
  ChainOfThoughtStep,
  ChainOfThoughtSearchResults,
  ChainOfThoughtSearchResult,
  ChainOfThoughtImage,
}
