"use client"

import * as React from "react"
import { cn } from "cn"

import type { LanguageModelUsage } from "ai"

import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Progress } from "@/components/ui/progress"

const PERCENT_MAX = 100
const ICON_RADIUS = 10
const ICON_VIEWBOX = 24
const ICON_CENTER = 12
const ICON_STROKE_WIDTH = 2

type ModelId = string

/**
 * Cost of the conversation, in USD.
 *
 * The upstream implementation reads the price from a pricing provider. This
 * registry has no such dependency, so the cost is supplied by the caller.
 */
export type ContextCost = {
  /** Total cost of the conversation. */
  total?: number
  /** Cost of the input tokens. */
  input?: number
  /** Cost of the output tokens. */
  output?: number
  /** Cost of the reasoning tokens. */
  reasoning?: number
  /** Cost of the cached tokens. */
  cache?: number
}

interface ContextSchema {
  usedTokens: number
  maxTokens: number
  usage?: LanguageModelUsage
  modelId?: ModelId
}

type ContextValue = ContextSchema & {
  cost?: ContextCost
}

const ContextContext = React.createContext<ContextValue | null>(null)

function useContextValue() {
  const context = React.useContext(ContextContext)

  if (!context) {
    throw new Error("Context components must be used within Context")
  }

  return context
}

function formatTokens(value: number) {
  return new Intl.NumberFormat("en-US", { notation: "compact" }).format(value)
}

function formatCost(value: number | undefined) {
  if (value === undefined) {
    return undefined
  }

  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    style: "currency",
  }).format(value)
}

export type ContextProps = React.ComponentProps<typeof HoverCard> &
  ContextSchema & {
    /** Cost of the conversation, in USD. */
    cost?: ContextCost
  }

export function Context({
  usedTokens,
  maxTokens,
  usage,
  modelId,
  cost,
  ...props
}: ContextProps) {
  const contextValue = React.useMemo(
    () => ({ cost, maxTokens, modelId, usage, usedTokens }),
    [cost, maxTokens, modelId, usage, usedTokens]
  )

  return (
    <ContextContext.Provider value={contextValue}>
      <HoverCard {...props} />
    </ContextContext.Provider>
  )
}

function ContextIcon() {
  const { usedTokens, maxTokens } = useContextValue()
  const circumference = 2 * Math.PI * ICON_RADIUS
  const usedPercent = maxTokens > 0 ? usedTokens / maxTokens : 0
  const dashOffset = circumference * (1 - usedPercent)

  return (
    <svg
      aria-hidden="true"
      height="20"
      style={{ color: "currentcolor" }}
      viewBox={`0 0 ${ICON_VIEWBOX} ${ICON_VIEWBOX}`}
      width="20"
    >
      <circle
        cx={ICON_CENTER}
        cy={ICON_CENTER}
        fill="none"
        opacity="0.25"
        r={ICON_RADIUS}
        stroke="currentColor"
        strokeWidth={ICON_STROKE_WIDTH}
      />
      <circle
        cx={ICON_CENTER}
        cy={ICON_CENTER}
        fill="none"
        opacity="0.7"
        r={ICON_RADIUS}
        stroke="currentColor"
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        strokeWidth={ICON_STROKE_WIDTH}
        style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
      />
    </svg>
  )
}

export type ContextTriggerProps = React.ComponentProps<typeof Button>

export function ContextTrigger({ children, ...props }: ContextTriggerProps) {
  const { usedTokens, maxTokens } = useContextValue()
  const usedPercent = maxTokens > 0 ? usedTokens / maxTokens : 0
  const renderedPercent = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
    style: "percent",
  }).format(usedPercent)

  return (
    <HoverCardTrigger
      delay={10}
      closeDelay={100}
      render={<Button variant="outline" size="sm" {...props} />}
    >
      {children ?? (
        <>
          <span className="font-medium text-muted-foreground">
            {renderedPercent}
          </span>
          <ContextIcon />
        </>
      )}
    </HoverCardTrigger>
  )
}

export type ContextContentProps = React.ComponentProps<typeof HoverCardContent>

export function ContextContent({ className, ...props }: ContextContentProps) {
  return (
    <HoverCardContent
      className={cn("w-64 divide-y overflow-hidden p-0", className)}
      {...props}
    />
  )
}

export type ContextContentHeaderProps = React.ComponentProps<"div">

export function ContextContentHeader({
  children,
  className,
  ...props
}: ContextContentHeaderProps) {
  const { usedTokens, maxTokens } = useContextValue()
  const usedPercent = maxTokens > 0 ? usedTokens / maxTokens : 0

  return (
    <div className={cn("w-full space-y-2 p-3", className)} {...props}>
      {children ?? (
        <>
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="font-medium">Context</span>
            <span className="text-muted-foreground">
              {formatTokens(usedTokens)} / {formatTokens(maxTokens)}
            </span>
          </div>
          <Progress
            aria-label="Context used"
            value={usedPercent * PERCENT_MAX}
          />
        </>
      )}
    </div>
  )
}

export type ContextContentBodyProps = React.ComponentProps<"div">

export function ContextContentBody({
  children,
  className,
  ...props
}: ContextContentBodyProps) {
  return (
    <div className={cn("w-full p-3", className)} {...props}>
      {children}
    </div>
  )
}

export type ContextContentFooterProps = React.ComponentProps<"div">

export function ContextContentFooter({
  children,
  className,
  ...props
}: ContextContentFooterProps) {
  const { cost } = useContextValue()

  return (
    <div
      className={cn(
        "flex w-full items-center justify-between gap-3 bg-secondary p-3 text-xs",
        className
      )}
      {...props}
    >
      {children ?? (
        <>
          <span className="text-muted-foreground">Total cost</span>
          <span>{formatCost(cost?.total) ?? "—"}</span>
        </>
      )}
    </div>
  )
}

function TokenCount({
  tokens,
  costText,
}: {
  tokens?: number
  costText?: string
}) {
  return (
    <span>
      {tokens === undefined ? "—" : formatTokens(tokens)}
      {costText ? (
        <span className="ml-2 text-muted-foreground">• {costText}</span>
      ) : null}
    </span>
  )
}

export type ContextInputUsageProps = React.ComponentProps<"div">

export function ContextInputUsage({
  className,
  children,
  ...props
}: ContextInputUsageProps) {
  const { cost, usage } = useContextValue()
  const inputTokens = usage?.inputTokens ?? 0

  if (children) {
    return children
  }

  if (!inputTokens) {
    return null
  }

  return (
    <div
      className={cn("flex items-center justify-between text-xs", className)}
      {...props}
    >
      <span className="text-muted-foreground">Input</span>
      <TokenCount costText={formatCost(cost?.input)} tokens={inputTokens} />
    </div>
  )
}

export type ContextOutputUsageProps = React.ComponentProps<"div">

export function ContextOutputUsage({
  className,
  children,
  ...props
}: ContextOutputUsageProps) {
  const { cost, usage } = useContextValue()
  const outputTokens = usage?.outputTokens ?? 0

  if (children) {
    return children
  }

  if (!outputTokens) {
    return null
  }

  return (
    <div
      className={cn("flex items-center justify-between text-xs", className)}
      {...props}
    >
      <span className="text-muted-foreground">Output</span>
      <TokenCount costText={formatCost(cost?.output)} tokens={outputTokens} />
    </div>
  )
}

export type ContextReasoningUsageProps = React.ComponentProps<"div">

export function ContextReasoningUsage({
  className,
  children,
  ...props
}: ContextReasoningUsageProps) {
  const { cost, usage } = useContextValue()
  const reasoningTokens = usage?.outputTokenDetails?.reasoningTokens ?? 0

  if (children) {
    return children
  }

  if (!reasoningTokens) {
    return null
  }

  return (
    <div
      className={cn("flex items-center justify-between text-xs", className)}
      {...props}
    >
      <span className="text-muted-foreground">Reasoning</span>
      <TokenCount
        costText={formatCost(cost?.reasoning)}
        tokens={reasoningTokens}
      />
    </div>
  )
}

export type ContextCacheUsageProps = React.ComponentProps<"div">

export function ContextCacheUsage({
  className,
  children,
  ...props
}: ContextCacheUsageProps) {
  const { cost, usage } = useContextValue()
  const cacheTokens = usage?.inputTokenDetails?.cacheReadTokens ?? 0

  if (children) {
    return children
  }

  if (!cacheTokens) {
    return null
  }

  return (
    <div
      className={cn("flex items-center justify-between text-xs", className)}
      {...props}
    >
      <span className="text-muted-foreground">Cache</span>
      <TokenCount costText={formatCost(cost?.cache)} tokens={cacheTokens} />
    </div>
  )
}
