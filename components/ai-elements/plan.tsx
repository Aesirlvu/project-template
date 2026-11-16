"use client"

import * as React from "react"
import { cn } from "cn"

import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"

type PlanContextValue = {
  isStreaming: boolean
}

const PlanContext = React.createContext<PlanContextValue | null>(null)

function usePlan() {
  const context = React.useContext(PlanContext)

  if (!context) {
    throw new Error("Plan components must be used within Plan")
  }

  return context
}

export type PlanProps = React.ComponentProps<"div"> & {
  isStreaming?: boolean
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

/**
 * The steps the agent plans to take, and how far it has got.
 */
function Plan({
  className,
  isStreaming = false,
  open,
  defaultOpen,
  onOpenChange,
  children,
  ...props
}: PlanProps) {
  const contextValue = React.useMemo(() => ({ isStreaming }), [isStreaming])
  const collapsibleProps: React.ComponentProps<typeof TraceCollapsible> =
    open === undefined
      ? { defaultOpen, onOpenChange }
      : { open, onOpenChange: onOpenChange ?? (() => undefined) }

  return (
    <PlanContext.Provider value={contextValue}>
      <Trace className={cn(className)} {...props}>
        <TraceCollapsible {...collapsibleProps}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            {children}
          </div>
        </TraceCollapsible>
      </Trace>
    </PlanContext.Provider>
  )
}

export type PlanHeaderProps = React.ComponentProps<
  typeof TraceCollapsibleTrigger
>

/**
 * The plan line. It opens and closes the steps.
 */
function PlanHeader({ className, children, ...props }: PlanHeaderProps) {
  const { isStreaming } = usePlan()

  return (
    <TraceCollapsibleTrigger className={cn(className)} {...props}>
      <TraceLine status={isStreaming ? "running" : undefined}>
        {children}
      </TraceLine>
    </TraceCollapsibleTrigger>
  )
}

export type PlanTitleProps = Omit<
  React.ComponentProps<typeof TraceTitle>,
  "children"
> & {
  children: React.ReactNode
}

/**
 * The goal of the plan.
 */
function PlanTitle({ children, ...props }: PlanTitleProps) {
  return <TraceTitle {...props}>{children}</TraceTitle>
}

export type PlanDescriptionProps = Omit<
  React.ComponentProps<typeof TraceDescription>,
  "children"
> & {
  children: React.ReactNode
}

/**
 * The progress of the plan, like "2 of 4 done".
 */
function PlanDescription({
  className,
  children,
  ...props
}: PlanDescriptionProps) {
  return (
    <TraceDescription className={cn("text-balance", className)} {...props}>
      {children}
    </TraceDescription>
  )
}

export type PlanActionProps = React.ComponentProps<"div">

/**
 * A slot for controls. It sits next to the plan line, never inside it.
 */
function PlanAction({ className, ...props }: PlanActionProps) {
  return <div className={cn("flex items-center gap-2", className)} {...props} />
}

export type PlanContentProps = React.ComponentProps<
  typeof TraceCollapsibleContent
>

/**
 * The steps of the plan.
 */
function PlanContent({ className, children, ...props }: PlanContentProps) {
  return (
    <div className="basis-full">
      <TraceCollapsibleContent className={cn(className)} {...props}>
        <Trace>{children}</Trace>
      </TraceCollapsibleContent>
    </div>
  )
}

export type PlanFooterProps = React.ComponentProps<"div">

/**
 * A plain container below the steps.
 */
function PlanFooter({ className, ...props }: PlanFooterProps) {
  return <div className={cn("basis-full", className)} {...props} />
}

export type PlanTriggerProps = React.ComponentProps<"button">

/**
 * Renders only its children. The plan line opens the plan, so this component
 * adds no trigger of its own. Keep it outside `PlanHeader`.
 */
function PlanTrigger({ children }: PlanTriggerProps) {
  return <>{children}</>
}

export {
  Plan,
  PlanHeader,
  PlanTitle,
  PlanDescription,
  PlanAction,
  PlanContent,
  PlanFooter,
  PlanTrigger,
}
