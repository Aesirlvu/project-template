"use client"

import * as React from "react"
import { cn } from "cn"
import {
  IconCircleX,
  IconCopy,
  IconFileCode,
  IconStack2,
} from "@tabler/icons-react"

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

/**
 * A frame of a stack trace.
 */
export type StackTraceFrame = {
  /** The raw line of the frame. */
  line: string
  /** The name of the function, when the line has one. */
  name?: string
  /** The path of the file, when the line has one. */
  file?: string
  /** The line number in the file, when the line has one. */
  lineNumber?: string
  /** The frame comes from a dependency or from Node itself. */
  internal: boolean
}

const FRAME_PATTERN = /^at (.+) \((.+):(\d+):(\d+)\)$/

/**
 * Reads a frame out of a stack trace line.
 */
export function parseStackTraceFrame(line: string): StackTraceFrame {
  const match = line.match(FRAME_PATTERN)

  return {
    line,
    name: match?.[1],
    file: match?.[2],
    lineNumber: match?.[3],
    internal: line.includes("node_modules") || line.includes("node:"),
  }
}

/**
 * Splits a stack trace into its error and its frames.
 */
export function parseStackTrace(trace: string): {
  error: string
  frames: StackTraceFrame[]
} {
  const [error = "", ...lines] = trace.split("\n").map((line) => line.trim())

  return {
    error,
    frames: lines.map(parseStackTraceFrame),
  }
}

type StackTraceContextValue = {
  error: string
  frames: StackTraceFrame[]
  onFilePathClick?: (file: string, lineNumber: string) => void
}

const StackTraceContext = React.createContext<StackTraceContextValue | null>(
  null
)

/**
 * The state of the stack trace.
 *
 * Throws when it is read outside of a `StackTrace`.
 */
export function useStackTrace() {
  const context = React.useContext(StackTraceContext)

  if (!context) {
    throw new Error("StackTrace components must be used within StackTrace")
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

export type StackTraceProps = Omit<
  React.ComponentProps<typeof TraceCollapsible>,
  "open" | "defaultOpen" | "onOpenChange" | "className"
> & {
  /** The stack of the error. */
  trace: string
  /** Controlled open state. */
  open?: boolean
  /** Uncontrolled initial open state. */
  defaultOpen?: boolean
  /** Called when the person opens or closes the frames. */
  onOpenChange?: (open: boolean) => void
  /** Called when the person opens a frame of their own code. */
  onFilePathClick?: (file: string, lineNumber: string) => void
  className?: string
}

/**
 * A failed tool call and the frames of its stack.
 */
function StackTrace({
  className,
  trace,
  open,
  defaultOpen,
  onOpenChange,
  onFilePathClick,
  children,
  ...props
}: StackTraceProps) {
  const [isOpen, setIsOpen] = useControllableState<boolean>({
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
    prop: open,
  })

  const { error, frames } = React.useMemo(() => parseStackTrace(trace), [trace])

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      setIsOpen(next)
    },
    [setIsOpen]
  )

  const contextValue = React.useMemo<StackTraceContextValue>(
    () => ({ error, frames, onFilePathClick }),
    [error, frames, onFilePathClick]
  )

  return (
    <StackTraceContext.Provider value={contextValue}>
      <Trace className={cn(className)}>
        <TraceCollapsible
          onOpenChange={handleOpenChange}
          open={isOpen}
          {...props}
        >
          {children}
        </TraceCollapsible>
      </Trace>
    </StackTraceContext.Provider>
  )
}

export type StackTraceHeaderProps = Omit<
  React.ComponentProps<typeof TraceCollapsibleTrigger>,
  "children"
> & {
  children?: React.ReactNode
}

/**
 * The line that opens the frames.
 */
function StackTraceHeader({
  className,
  children,
  ...props
}: StackTraceHeaderProps) {
  return (
    <TraceCollapsibleTrigger className={cn(className)} {...props}>
      <TraceLine status="error">
        <TraceIcon>
          <IconCircleX />
        </TraceIcon>
        {children}
      </TraceLine>
    </TraceCollapsibleTrigger>
  )
}

export type StackTraceErrorTypeProps = React.ComponentProps<"span">

/**
 * The kind of the error, like "TypeError".
 */
function StackTraceErrorType({
  className,
  ...props
}: StackTraceErrorTypeProps) {
  return <span className={cn("font-semibold", className)} {...props} />
}

export type StackTraceErrorMessageProps = React.ComponentProps<"span">

/**
 * The message of the error.
 */
function StackTraceErrorMessage({
  className,
  ...props
}: StackTraceErrorMessageProps) {
  return <span className={cn("font-normal", className)} {...props} />
}

export type StackTraceErrorProps = React.ComponentProps<typeof TraceTitle>

/**
 * The error of the failed call, like "Failed: TypeError: …".
 */
function StackTraceError({
  className,
  children,
  ...props
}: StackTraceErrorProps) {
  const context = React.useContext(StackTraceContext)
  const error = context?.error ?? ""
  const separator = error.indexOf(": ")
  const errorType = separator === -1 ? error : error.slice(0, separator)
  const message = separator === -1 ? "" : error.slice(separator + 2)

  return (
    <TraceTitle className={cn(className)} {...props}>
      {errorType ? (
        <>
          Failed: <StackTraceErrorType>{errorType}</StackTraceErrorType>
          {message ? (
            <>
              {": "}
              <StackTraceErrorMessage>{message}</StackTraceErrorMessage>
            </>
          ) : null}
        </>
      ) : (
        "Failed"
      )}
      {children}
    </TraceTitle>
  )
}

export type StackTraceContentProps = React.ComponentProps<
  typeof TraceCollapsibleContent
>

/**
 * The frames of the stack.
 */
function StackTraceContent({
  className,
  children,
  ...props
}: StackTraceContentProps) {
  return (
    <TraceCollapsibleContent className={cn(className)} {...props}>
      {children}
    </TraceCollapsibleContent>
  )
}

export type StackTraceFramesProps = React.ComponentProps<"div">

/**
 * The frames of the stack.
 *
 * The frames of your own code come first, each one opening the file at the
 * line. The frames of a dependency fold into a line of their own, so the
 * frames you can fix stand out.
 */
function StackTraceFrames({
  className,
  children,
  ...props
}: StackTraceFramesProps) {
  const context = React.useContext(StackTraceContext)
  const frames = context?.frames ?? []
  const onFilePathClick = context?.onFilePathClick
  const appFrames = frames.filter((frame) => !frame.internal)
  const internalFrames = frames.filter((frame) => frame.internal)

  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      <Trace>
        {appFrames.map((frame) => (
          <TraceLine key={frame.line}>
            <TraceIcon>
              <IconFileCode />
            </TraceIcon>
            <TraceTitle>
              <button
                type="button"
                className="text-left hover:text-foreground hover:underline"
                onClick={() =>
                  onFilePathClick?.(frame.file ?? "", frame.lineNumber ?? "")
                }
              >
                {frame.name} in {frame.file}:{frame.lineNumber}
              </button>
            </TraceTitle>
          </TraceLine>
        ))}
        {internalFrames.length > 0 ? (
          <TraceCollapsible>
            <TraceCollapsibleTrigger>
              <TraceLine>
                <TraceIcon>
                  <IconStack2 />
                </TraceIcon>
                <TraceTitle>
                  {internalFrames.length} framework frames
                </TraceTitle>
              </TraceLine>
            </TraceCollapsibleTrigger>
            <TraceCollapsibleContent>
              <ol className="flex flex-col gap-1 overflow-x-auto rounded-md bg-muted p-3 font-mono text-xs">
                {internalFrames.map((frame) => (
                  <li
                    key={frame.line}
                    className="whitespace-nowrap text-muted-foreground/60"
                  >
                    {frame.line}
                  </li>
                ))}
              </ol>
            </TraceCollapsibleContent>
          </TraceCollapsible>
        ) : null}
      </Trace>
      {children}
    </div>
  )
}

export type StackTraceExpandButtonProps = React.ComponentProps<"button">

/**
 * Renders only its children.
 *
 * The whole line opens the frames, so this component adds no trigger of its
 * own.
 */
function StackTraceExpandButton({ children }: StackTraceExpandButtonProps) {
  return <>{children}</>
}

export type StackTraceActionsProps = React.ComponentProps<"div">

/**
 * A slot for controls, like the copy button.
 *
 * It sits next to the line, never inside the trigger.
 */
function StackTraceActions({ className, ...props }: StackTraceActionsProps) {
  return (
    <div
      data-slot="stack-trace-actions"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  )
}

export type StackTraceCopyButtonProps = React.ComponentProps<typeof Button> & {
  /** The text to copy. Defaults to the stack of the error. */
  value?: string
}

/**
 * Copies the stack of the error.
 */
function StackTraceCopyButton({
  className,
  value,
  variant = "ghost",
  size = "icon-xs",
  ...props
}: StackTraceCopyButtonProps) {
  const context = React.useContext(StackTraceContext)
  const error = context?.error ?? ""
  const frames = context?.frames ?? []
  const text = value ?? [error, ...frames.map((frame) => frame.line)].join("\n")

  return (
    <Button
      data-slot="stack-trace-copy-button"
      variant={variant}
      size={size}
      aria-label="Copy"
      className={cn(className)}
      onClick={() => {
        navigator.clipboard.writeText(text).catch(() => {})
      }}
      {...props}
    >
      <IconCopy />
    </Button>
  )
}

export {
  StackTrace,
  StackTraceActions,
  StackTraceContent,
  StackTraceCopyButton,
  StackTraceError,
  StackTraceErrorMessage,
  StackTraceErrorType,
  StackTraceExpandButton,
  StackTraceFrames,
  StackTraceHeader,
}
