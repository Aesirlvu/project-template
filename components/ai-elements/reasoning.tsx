"use client"

import * as React from "react"
import { cn } from "cn"
import { IconCircleCheck, IconLoader } from "@tabler/icons-react"

import { Markdown } from "@/components/markdown"
import { Collapsible } from "@/components/ui/collapsible"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"

const AUTO_CLOSE_DELAY = 1000
const MS_IN_S = 1000

type ReasoningContextValue = {
  isStreaming: boolean
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  duration: number | undefined
}

const ReasoningContext = React.createContext<ReasoningContextValue | null>(null)

/**
 * The state of the reasoning line.
 *
 * Throws when it is read outside of a `Reasoning`.
 */
export function useReasoning() {
  const context = React.useContext(ReasoningContext)

  if (!context) {
    throw new Error("Reasoning components must be used within Reasoning")
  }

  return context
}

/**
 * A controlled or uncontrolled value.
 *
 * The controlled prop wins when it is defined, otherwise the internal state
 * is the source of truth.
 */
function useControllableState<T>({
  prop,
  defaultProp,
  onChange,
}: {
  prop?: T | undefined
  defaultProp: T
  onChange?: (value: T) => void
}) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultProp)
  const isControlled = prop !== undefined
  const value = isControlled ? prop : uncontrolledValue

  const setValue = React.useCallback(
    (next: T) => {
      if (!isControlled) {
        setUncontrolledValue(next)
      }
      onChange?.(next)
    },
    [isControlled, onChange]
  )

  return [value, setValue] as const
}

export type ReasoningProps = Omit<
  React.ComponentProps<typeof Collapsible>,
  "open" | "defaultOpen" | "onOpenChange" | "render" | "className"
> & {
  /** The model is still thinking. */
  isStreaming?: boolean
  /** Controlled open state. */
  open?: boolean
  /** Uncontrolled initial open state. */
  defaultOpen?: boolean
  /** Called when the person opens or closes the thinking. */
  onOpenChange?: (open: boolean) => void
  /** How long the thinking took, in seconds. */
  duration?: number
  className?: string
}

/**
 * The agent's thinking.
 *
 * The line opens while the model thinks and closes when it is done, unless
 * the person opened or closed it themselves.
 */
function Reasoning({
  className,
  isStreaming = false,
  open,
  defaultOpen,
  onOpenChange,
  duration: durationProp,
  children,
  ...props
}: ReasoningProps) {
  const resolvedDefaultOpen = defaultOpen ?? isStreaming
  // An explicit `defaultOpen={false}` opts out of the automatic opening.
  const isExplicitlyClosed = defaultOpen === false

  const [isOpen, setIsOpen] = useControllableState<boolean>({
    defaultProp: resolvedDefaultOpen,
    onChange: onOpenChange,
    prop: open,
  })
  const [duration, setDuration] = useControllableState<number | undefined>({
    defaultProp: undefined,
    prop: durationProp,
  })

  const hasEverStreamedRef = React.useRef(isStreaming)
  const [hasAutoClosed, setHasAutoClosed] = React.useState(false)
  const startTimeRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    if (isStreaming) {
      hasEverStreamedRef.current = true
      if (startTimeRef.current === null) {
        startTimeRef.current = Date.now()
      }
    } else if (startTimeRef.current !== null) {
      setDuration(Math.ceil((Date.now() - startTimeRef.current) / MS_IN_S))
      startTimeRef.current = null
    }
  }, [isStreaming, setDuration])

  React.useEffect(() => {
    if (isStreaming && !isOpen && !isExplicitlyClosed) {
      setIsOpen(true)
    }
  }, [isStreaming, isOpen, setIsOpen, isExplicitlyClosed])

  React.useEffect(() => {
    if (
      hasEverStreamedRef.current &&
      !isStreaming &&
      isOpen &&
      !hasAutoClosed
    ) {
      const timer = setTimeout(() => {
        setIsOpen(false)
        setHasAutoClosed(true)
      }, AUTO_CLOSE_DELAY)

      return () => clearTimeout(timer)
    }
  }, [isStreaming, isOpen, setIsOpen, hasAutoClosed])

  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      setIsOpen(newOpen)
    },
    [setIsOpen]
  )

  const contextValue = React.useMemo<ReasoningContextValue>(
    () => ({ duration, isOpen, isStreaming, setIsOpen }),
    [duration, isOpen, isStreaming, setIsOpen]
  )

  return (
    <ReasoningContext.Provider value={contextValue}>
      <Trace className={className}>
        <TraceCollapsible
          onOpenChange={handleOpenChange}
          open={isOpen}
          {...props}
        >
          {children}
        </TraceCollapsible>
      </Trace>
    </ReasoningContext.Provider>
  )
}

export type ReasoningTriggerProps = React.ComponentProps<
  typeof TraceCollapsibleTrigger
> & {
  /** Builds the title of the line. */
  getThinkingMessage?: (
    isStreaming: boolean,
    duration?: number
  ) => React.ReactNode
}

const defaultGetThinkingMessage = (
  isStreaming: boolean,
  duration?: number
): React.ReactNode => {
  if (isStreaming) {
    return "Thinking"
  }

  if (duration === undefined) {
    return "Thought"
  }

  return `Thought for ${duration}s`
}

/** The line that opens the thinking. */
function ReasoningTrigger({
  className,
  children,
  getThinkingMessage = defaultGetThinkingMessage,
  ...props
}: ReasoningTriggerProps) {
  const { isStreaming, duration } = useReasoning()

  return (
    <TraceCollapsibleTrigger className={className} {...props}>
      <TraceLine status={isStreaming ? "running" : undefined}>
        <TraceIcon>
          {isStreaming ? (
            <IconLoader className="animate-spin" />
          ) : (
            <IconCircleCheck />
          )}
        </TraceIcon>
        <TraceTitle>{getThinkingMessage(isStreaming, duration)}</TraceTitle>
      </TraceLine>
      {children}
    </TraceCollapsibleTrigger>
  )
}

export type ReasoningContentProps = Omit<
  React.ComponentProps<typeof TraceCollapsibleContent>,
  "children"
> & {
  children: string
}

/** The thinking itself. */
function ReasoningContent({
  className,
  children,
  ...props
}: ReasoningContentProps) {
  return (
    <TraceCollapsibleContent className={cn(className)} {...props}>
      <Markdown>{children}</Markdown>
    </TraceCollapsibleContent>
  )
}

export { Reasoning, ReasoningContent, ReasoningTrigger }
