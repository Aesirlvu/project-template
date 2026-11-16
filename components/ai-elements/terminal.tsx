"use client"

import * as React from "react"
import { cn } from "cn"
import { IconTerminal } from "@tabler/icons-react"

import { CodeBlock, CodeBlockContent } from "@/components/ui/code-block"
import { Button } from "@/components/ui/button"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"

type TerminalContextValue = {
  isStreaming: boolean
  output: string
  clear: () => void
  scrollRef: React.RefObject<HTMLPreElement | null>
}

const TerminalContext = React.createContext<TerminalContextValue | null>(null)

/**
 * The state of the terminal line.
 *
 * Throws when it is read outside of a `Terminal`.
 */
export function useTerminal() {
  const context = React.useContext(TerminalContext)

  if (!context) {
    throw new Error("Terminal components must be used within Terminal")
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

export type TerminalProps = Omit<
  React.ComponentProps<typeof TraceCollapsible>,
  "open" | "defaultOpen" | "onOpenChange" | "className"
> & {
  /** The output of the command. It grows while the command runs. */
  output?: string
  /** The command is still running. */
  isStreaming?: boolean
  /** Follow the output while it grows. */
  autoScroll?: boolean
  /** Called when the person clears the output. */
  onClear?: () => void
  /** Controlled open state. */
  open?: boolean
  /** Uncontrolled initial open state. */
  defaultOpen?: boolean
  /** Called when the person opens or closes the output. */
  onOpenChange?: (open: boolean) => void
  className?: string
}

/**
 * A shell command the agent runs, with its output underneath.
 *
 * The line opens once the first output arrives while the command runs, and
 * stays open afterwards.
 */
function Terminal({
  className,
  output = "",
  isStreaming = false,
  autoScroll = false,
  onClear,
  open,
  defaultOpen,
  onOpenChange,
  children,
  ...props
}: TerminalProps) {
  const [isOpen, setIsOpen] = useControllableState<boolean>({
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
    prop: open,
  })

  const scrollRef = React.useRef<HTMLPreElement | null>(null)

  // The line opens while the command runs, once the output arrives.
  const hasOutput = output.length > 0
  const shouldAutoOpen = isStreaming && hasOutput

  React.useEffect(() => {
    if (shouldAutoOpen) {
      setIsOpen(true)
    }
  }, [shouldAutoOpen, setIsOpen])

  // Follow the output while it grows.
  React.useEffect(() => {
    if (!autoScroll) {
      return
    }

    const element = scrollRef.current

    if (element) {
      element.scrollTop = element.scrollHeight
    }
  }, [autoScroll, output])

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      setIsOpen(next)
    },
    [setIsOpen]
  )

  const clear = React.useCallback(() => {
    onClear?.()
  }, [onClear])

  const contextValue = React.useMemo<TerminalContextValue>(
    () => ({ clear, isStreaming, output, scrollRef }),
    [clear, isStreaming, output]
  )

  return (
    <TerminalContext.Provider value={contextValue}>
      <Trace className={cn(className)}>
        <TraceCollapsible
          onOpenChange={handleOpenChange}
          open={isOpen}
          {...props}
        >
          {children}
        </TraceCollapsible>
      </Trace>
    </TerminalContext.Provider>
  )
}

export type TerminalHeaderProps = Omit<
  React.ComponentProps<typeof TraceCollapsibleTrigger>,
  "children"
> & {
  children?: React.ReactNode
}

/**
 * The line that opens the output.
 */
function TerminalHeader({
  className,
  children,
  ...props
}: TerminalHeaderProps) {
  const { isStreaming } = useTerminal()

  return (
    <TraceCollapsibleTrigger className={cn(className)} {...props}>
      <TraceLine status={isStreaming ? "running" : undefined}>
        {children}
      </TraceLine>
    </TraceCollapsibleTrigger>
  )
}

export type TerminalTitleProps = React.ComponentProps<typeof TraceTitle>

/**
 * The title of the command, like "Ran pnpm build".
 *
 * It renders the terminal icon next to the title, inside the line.
 */
function TerminalTitle({ className, children, ...props }: TerminalTitleProps) {
  return (
    <>
      <TraceIcon>
        <IconTerminal />
      </TraceIcon>
      <TraceTitle className={cn(className)} {...props}>
        {children}
      </TraceTitle>
    </>
  )
}

export type TerminalStatusProps = React.ComponentProps<"span">

/**
 * A slot for the state of the command, like an exit code.
 *
 * It sits next to the line, never inside the trigger.
 */
function TerminalStatus({ className, ...props }: TerminalStatusProps) {
  return <span className={cn("text-muted-foreground", className)} {...props} />
}

export type TerminalActionsProps = React.ComponentProps<"div">

/**
 * A slot for controls, like the copy and clear buttons.
 *
 * It sits next to the line, never inside the trigger.
 */
function TerminalActions({ className, ...props }: TerminalActionsProps) {
  return (
    <div
      data-slot="terminal-actions"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  )
}

export type TerminalContentProps = Omit<
  React.ComponentProps<typeof TraceCollapsibleContent>,
  "children"
> & {
  /** The output of the command. */
  children?: React.ReactNode
}

/**
 * The output of the command.
 */
function TerminalContent({
  className,
  children,
  ...props
}: TerminalContentProps) {
  const { output, scrollRef } = useTerminal()

  return (
    <TraceCollapsibleContent className={cn(className)} {...props}>
      <CodeBlock size="sm">
        <CodeBlockContent ref={scrollRef} wrap className="max-h-64">
          {children ?? output}
        </CodeBlockContent>
      </CodeBlock>
    </TraceCollapsibleContent>
  )
}

export type TerminalClearButtonProps = React.ComponentProps<typeof Button> & {
  /** The text of the button. */
  children?: React.ReactNode
}

/**
 * Clears the output of the command.
 *
 * It sits next to the line, never inside the trigger.
 */
function TerminalClearButton({
  className,
  children,
  variant = "ghost",
  size = "xs",
  ...props
}: TerminalClearButtonProps) {
  const { clear } = useTerminal()

  return (
    <Button
      data-slot="terminal-clear-button"
      variant={variant}
      size={size}
      className={cn(className)}
      onClick={clear}
      {...props}
    >
      {children ?? "Clear"}
    </Button>
  )
}

export {
  Terminal,
  TerminalActions,
  TerminalClearButton,
  TerminalContent,
  TerminalHeader,
  TerminalStatus,
  TerminalTitle,
}
