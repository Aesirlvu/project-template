"use client"

import * as React from "react"
import { cn } from "cn"
import type { ToolUIPart } from "ai"
import {
  IconAlertCircle,
  IconCircleCheck,
  IconCircleDashed,
  IconCircleDot,
  IconCircleX,
  IconLoader,
  IconTerminal,
} from "@tabler/icons-react"

import { CodeBlock, CodeBlockContent } from "@/components/ui/code-block"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"

/**
 * A tool part of a chat message.
 */
export type ToolPart = ToolUIPart

/**
 * The states a tool part can be in.
 */
export type ToolState = ToolPart["state"]

/**
 * The status of the line, derived from the state of the tool part.
 */
export type ToolStatus = "running" | "error" | undefined

/**
 * The prefix of the title of the line, per state.
 */
const STATE_TITLES: Record<ToolState, string> = {
  "input-streaming": "Running",
  "input-available": "Running",
  "approval-requested": "Awaiting approval for",
  "approval-responded": "Running",
  "output-available": "Ran",
  "output-error": "Failed to run",
  "output-denied": "Denied",
}

/**
 * The status of the line, per state.
 */
const STATE_STATUSES: Record<ToolState, ToolStatus> = {
  "input-streaming": "running",
  "input-available": "running",
  "approval-requested": "running",
  "approval-responded": "running",
  "output-available": undefined,
  "output-error": "error",
  "output-denied": undefined,
}

/**
 * The title of the line, derived from the state of the tool part.
 */
export function getToolTitle(part: ToolPart): string {
  const label = part.title ?? part.type.split("-").slice(1).join("-")

  if (part.state === "approval-responded" && !part.approval.approved) {
    return `Denied ${label}`
  }

  return `${STATE_TITLES[part.state]} ${label}`
}

/**
 * The status of the line, derived from the state of the tool part.
 */
export function getToolStatus(part: ToolPart): ToolStatus {
  return STATE_STATUSES[part.state]
}

const STATUS_LABELS: Record<ToolState, string> = {
  "input-streaming": "Pending",
  "input-available": "Running",
  "approval-requested": "Awaiting Approval",
  "approval-responded": "Responded",
  "output-available": "Completed",
  "output-error": "Error",
  "output-denied": "Denied",
}

/**
 * The icon that goes with the state of the tool part.
 */
function getStatusIcon(state: ToolState) {
  switch (state) {
    case "input-streaming":
      return <IconCircleDashed />
    case "input-available":
      return <IconLoader className="animate-spin" />
    case "approval-requested":
      return <IconCircleDot />
    case "approval-responded":
      return <IconCircleCheck />
    case "output-available":
      return <IconCircleCheck />
    case "output-error":
      return <IconAlertCircle />
    case "output-denied":
      return <IconCircleX />
  }
}

/**
 * The badge that shows the state of the tool part.
 *
 * The line shows the state in its title instead, but the badge is kept so
 * existing code keeps working.
 */
export function getStatusBadge(state: ToolState) {
  return (
    <span
      data-slot="tool-status-badge"
      data-state={state}
      className="inline-flex items-center gap-1.5 text-xs"
    >
      <span className="[&_svg]:size-3.5">{getStatusIcon(state)}</span>
      {STATUS_LABELS[state]}
    </span>
  )
}

export type ToolProps = React.ComponentProps<typeof TraceCollapsible>

/**
 * A tool call the agent makes, from input to output.
 */
function Tool({ className, children, ...props }: ToolProps) {
  return (
    <Trace className={cn(className)}>
      <TraceCollapsible {...props}>{children}</TraceCollapsible>
    </Trace>
  )
}

export type ToolHeaderProps = Omit<
  React.ComponentProps<typeof TraceCollapsibleTrigger>,
  "type"
> & {
  /** The tool part the line describes. */
  part?: ToolPart
  /** The title of the line. Defaults to the name of the tool. */
  title?: string
  /** The type of the tool part, like "tool-runCommand". */
  type?: string
  /** The state of the tool part. */
  state?: ToolState
}

/**
 * The line that opens the output of the tool.
 *
 * The state of the tool part maps to the status and the title of the line.
 */
function ToolHeader({
  className,
  children,
  part,
  title,
  type,
  state,
  ...props
}: ToolHeaderProps) {
  const resolvedState = part?.state ?? state
  const label = title ?? part?.title ?? type?.split("-").slice(1).join("-")
  const resolvedTitle = part
    ? getToolTitle(part)
    : resolvedState
      ? `${STATE_TITLES[resolvedState]} ${label ?? ""}`.trim()
      : label
  const status = part
    ? getToolStatus(part)
    : resolvedState
      ? STATE_STATUSES[resolvedState]
      : undefined

  return (
    <TraceCollapsibleTrigger className={cn(className)} {...props}>
      <TraceLine status={status}>
        <TraceIcon>
          <IconTerminal />
        </TraceIcon>
        <TraceTitle>{resolvedTitle}</TraceTitle>
        {children}
      </TraceLine>
    </TraceCollapsibleTrigger>
  )
}

export type ToolContentProps = React.ComponentProps<
  typeof TraceCollapsibleContent
>

/**
 * The output of the tool.
 */
function ToolContent({ className, children, ...props }: ToolContentProps) {
  return (
    <TraceCollapsibleContent className={cn(className)} {...props}>
      {children}
    </TraceCollapsibleContent>
  )
}

export type ToolInputProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** The input of the tool call. */
  input: unknown
}

/**
 * The input of the tool call.
 */
function ToolInput({ className, input, ...props }: ToolInputProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      <CodeBlock size="sm">
        <CodeBlockContent wrap className="max-h-64">
          {typeof input === "string" ? input : JSON.stringify(input, null, 2)}
        </CodeBlockContent>
      </CodeBlock>
    </div>
  )
}

export type ToolOutputProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** The output of the tool call. */
  output?: unknown
  /** The error of the tool call. It replaces the output when it is set. */
  errorText?: string
}

/**
 * The output of the tool call.
 *
 * The error replaces the output when the tool failed.
 */
function ToolOutput({
  className,
  output,
  errorText,
  ...props
}: ToolOutputProps) {
  if (output === undefined && !errorText) {
    return null
  }

  const content = errorText
    ? errorText
    : typeof output === "string"
      ? output
      : JSON.stringify(output, null, 2)

  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      <CodeBlock size="sm">
        <CodeBlockContent wrap className="max-h-64">
          {content}
        </CodeBlockContent>
      </CodeBlock>
    </div>
  )
}

export { Tool, ToolContent, ToolHeader, ToolInput, ToolOutput }
