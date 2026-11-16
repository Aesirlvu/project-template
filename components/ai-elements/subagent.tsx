"use client"

import * as React from "react"
import type { DynamicToolUIPart, ToolUIPart } from "ai"
import { cn } from "cn"
import { IconRobot, IconTool } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
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

export type AgentProps = React.ComponentProps<"div">

/**
 * A run the agent handed to a subagent.
 *
 * The run is a collapsible trace: the header is the title of the run and the
 * content holds the tool calls the subagent made and what it found.
 */
function Agent({ className, children, ...props }: AgentProps) {
  return (
    <Trace className={cn("w-full max-w-sm", className)} {...props}>
      <TraceCollapsible defaultOpen>{children}</TraceCollapsible>
    </Trace>
  )
}

export type AgentHeaderProps = React.ComponentProps<
  typeof TraceCollapsibleTrigger
> & {
  name: string
  model?: string
}

/**
 * The title of a run.
 *
 * The name reads like "Ran the research agent" and the model, when there is
 * one, sits next to it as a badge.
 */
function AgentHeader({
  className,
  name,
  model,
  children,
  ...props
}: AgentHeaderProps) {
  return (
    <TraceCollapsibleTrigger className={cn(className)} {...props}>
      <TraceLine>
        <TraceIcon>
          <IconRobot />
        </TraceIcon>
        <TraceTitle>{children ?? name}</TraceTitle>
        {model ? (
          <Badge className="font-mono" variant="secondary">
            {model}
          </Badge>
        ) : null}
      </TraceLine>
    </TraceCollapsibleTrigger>
  )
}

export type AgentContentProps = React.ComponentProps<"div">

/** The body of a run: the task, the tool calls and the report. */
function AgentContent({ className, children, ...props }: AgentContentProps) {
  return (
    <TraceCollapsibleContent
      className={cn("flex flex-col gap-3", className)}
      keepMounted
      {...props}
    >
      {children}
    </TraceCollapsibleContent>
  )
}

export type AgentInstructionsProps = React.ComponentProps<"div"> & {
  children: string
}

/** The task the subagent was given. */
function AgentInstructions({
  className,
  children,
  ...props
}: AgentInstructionsProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      <span className="text-sm font-medium text-muted-foreground">
        Instructions
      </span>
      <div className="bg-muted/50 p-3 text-sm text-muted-foreground">
        <p>{children}</p>
      </div>
    </div>
  )
}

export type AgentToolsProps = React.ComponentProps<typeof Trace>

/** The tool calls the subagent made. */
function AgentTools({ className, children, ...props }: AgentToolsProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <span className="text-sm font-medium text-muted-foreground">Tools</span>
      <Trace {...props}>{children}</Trace>
    </div>
  )
}

export type AgentToolProps = React.ComponentProps<typeof TraceLine> & {
  tool: ToolUIPart | DynamicToolUIPart
}

/**
 * The label of a tool call.
 *
 * A tool part carries its name in `title`, in `toolName` for dynamic tools, or
 * in the `tool-<name>` type. The tool description lives in the tool definition
 * rather than in the part, so it is not available here.
 */
function getToolLabel(tool: ToolUIPart | DynamicToolUIPart): string {
  if (tool.type === "dynamic-tool") {
    return tool.title ?? tool.toolName
  }

  return tool.title ?? tool.type.replace(/^tool-/, "")
}

/**
 * A single tool call of a subagent.
 *
 * The line names the tool and, when it has a description, shows it as the
 * title. The schema of the tool is available to the caller as children.
 */
function AgentTool({ className, tool, children, ...props }: AgentToolProps) {
  return (
    <TraceLine className={cn(className)} {...props}>
      <TraceIcon>
        <IconTool />
      </TraceIcon>
      <TraceTitle>{children ?? getToolLabel(tool)}</TraceTitle>
    </TraceLine>
  )
}

export type AgentOutputProps = React.ComponentProps<"div"> & {
  schema: string
}

/** The output schema the subagent answers with. */
function AgentOutput({
  className,
  schema,
  children,
  ...props
}: AgentOutputProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      <span className="text-sm font-medium text-muted-foreground">
        Output Schema
      </span>
      <CodeBlock size="sm">
        <CodeBlockContent wrap>{children ?? schema}</CodeBlockContent>
      </CodeBlock>
    </div>
  )
}

export {
  Agent,
  AgentContent,
  AgentHeader,
  AgentInstructions,
  AgentOutput,
  AgentTool,
  AgentTools,
}
