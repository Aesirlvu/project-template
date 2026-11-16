"use client"

import * as React from "react"
import { cn } from "cn"
import {
  IconCheck,
  IconCircleDashed,
  IconCircleDot,
  IconFlask,
  IconX,
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

export type TestStatus = "passed" | "failed" | "skipped" | "running"

export type TestResultsSummary = {
  passed: number
  failed: number
  skipped: number
  total: number
  duration?: number
}

type TestResultsContextValue = {
  summary?: TestResultsSummary
}

const TestResultsContext = React.createContext<TestResultsContextValue>({})

function formatDuration(ms: number) {
  if (ms < 1000) {
    return `${ms}ms`
  }
  return `${(ms / 1000).toFixed(2)}s`
}

/**
 * Formats the counts of a run, for example "42 tests, 2 failed".
 *
 * Only the counts that are not zero are written out.
 */
function formatCounts({
  total,
  failed,
  skipped,
}: {
  total: number
  failed: number
  skipped: number
}) {
  return [
    `${total} tests`,
    failed > 0 && `${failed} failed`,
    skipped > 0 && `${skipped} skipped`,
  ]
    .filter(Boolean)
    .join(", ")
}

const statusIcons: Record<TestStatus, React.ReactNode> = {
  failed: <IconX />,
  passed: <IconCheck />,
  running: <IconCircleDot className="animate-pulse" />,
  skipped: <IconCircleDashed />,
}

export type TestResultsProps = React.ComponentProps<"div"> & {
  summary?: TestResultsSummary
}

/**
 * A test run by the agent.
 *
 * The summary travels down through context so the header, the duration and the
 * progress bar all read the same numbers.
 */
function TestResults({
  summary,
  className,
  children,
  ...props
}: TestResultsProps) {
  const contextValue = React.useMemo(() => ({ summary }), [summary])

  return (
    <TestResultsContext.Provider value={contextValue}>
      <Trace className={cn("w-full max-w-sm", className)} {...props}>
        <TraceCollapsible defaultOpen>{children}</TraceCollapsible>
      </Trace>
    </TestResultsContext.Provider>
  )
}

export type TestResultsHeaderProps = React.ComponentProps<
  typeof TraceCollapsibleTrigger
>

/**
 * The title of a run.
 *
 * It is the trigger of the collapsible that holds the suites, so opening the
 * line opens the run. Without children it falls back to the counts of the
 * run, so the header is never empty.
 */
function TestResultsHeader({
  className,
  children,
  ...props
}: TestResultsHeaderProps) {
  const { summary } = React.useContext(TestResultsContext)
  const failed = summary?.failed ?? 0

  return (
    <TraceCollapsibleTrigger className={cn(className)} {...props}>
      <TraceLine status={failed > 0 ? "error" : undefined}>
        <TraceIcon>
          <IconFlask />
        </TraceIcon>
        {children ?? <TestResultsSummary />}
      </TraceLine>
    </TraceCollapsibleTrigger>
  )
}

export type TestResultsSummaryProps = React.ComponentProps<"span">

/** The counts of the run, for example "Ran 42 tests, 2 failed". */
function TestResultsSummary({
  className,
  children,
  ...props
}: TestResultsSummaryProps) {
  const { summary } = React.useContext(TestResultsContext)

  if (!summary) {
    return null
  }

  return (
    <TraceTitle className={cn(className)} {...props}>
      {children ?? `Ran ${formatCounts(summary)}`}
    </TraceTitle>
  )
}

export type TestResultsDurationProps = React.ComponentProps<"span">

/** How long the run took. */
function TestResultsDuration({
  className,
  children,
  ...props
}: TestResultsDurationProps) {
  const { summary } = React.useContext(TestResultsContext)

  if (!summary?.duration) {
    return null
  }

  return (
    <span className={cn("text-sm text-muted-foreground", className)} {...props}>
      {children ?? formatDuration(summary.duration)}
    </span>
  )
}

export type TestResultsProgressProps = React.ComponentProps<"div">

/** The share of the run that passed. */
function TestResultsProgress({
  className,
  children,
  ...props
}: TestResultsProgressProps) {
  const { summary } = React.useContext(TestResultsContext)

  if (!summary) {
    return null
  }

  const passedPercent =
    summary.total > 0 ? (summary.passed / summary.total) * 100 : 0
  const failedPercent =
    summary.total > 0 ? (summary.failed / summary.total) * 100 : 0

  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      {children ?? (
        <>
          <div className="flex h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="bg-green-500 transition-all"
              style={{ width: `${passedPercent}%` }}
            />
            <div
              className="bg-red-500 transition-all"
              style={{ width: `${failedPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              {summary.passed}/{summary.total} tests passed
            </span>
            <span>{passedPercent.toFixed(0)}%</span>
          </div>
        </>
      )}
    </div>
  )
}

export type TestResultsContentProps = React.ComponentProps<"div">

/** The suites of the run. */
function TestResultsContent({
  className,
  children,
  ...props
}: TestResultsContentProps) {
  return (
    <TraceCollapsibleContent className={cn(className)} keepMounted {...props}>
      <Trace>{children}</Trace>
    </TraceCollapsibleContent>
  )
}

type TestSuiteContextValue = {
  name: string
  status: TestStatus
}

const TestSuiteContext = React.createContext<TestSuiteContextValue>({
  name: "",
  status: "passed",
})

export type TestSuiteProps = React.ComponentProps<"div"> & {
  name: string
  status: TestStatus
}

/**
 * A suite of tests, grouped by file.
 *
 * A suite with a failure opens by default so the error is one click away.
 */
function TestSuite({
  name,
  status,
  className,
  children,
  ...props
}: TestSuiteProps) {
  const contextValue = React.useMemo(() => ({ name, status }), [name, status])

  return (
    <TestSuiteContext.Provider value={contextValue}>
      <TraceCollapsible
        className={cn(className)}
        defaultOpen={status === "failed"}
        {...props}
      >
        {children}
      </TraceCollapsible>
    </TestSuiteContext.Provider>
  )
}

export type TestSuiteNameProps = React.ComponentProps<
  typeof TraceCollapsibleTrigger
>

/** The title of a suite, for example "cart.test.ts, 3 tests". */
function TestSuiteName({ className, children, ...props }: TestSuiteNameProps) {
  const { name, status } = React.useContext(TestSuiteContext)

  return (
    <TraceCollapsibleTrigger className={cn(className)} {...props}>
      <TraceLine status={status === "failed" ? "error" : undefined}>
        <TraceIcon>{statusIcons[status]}</TraceIcon>
        <TraceTitle>{children ?? name}</TraceTitle>
      </TraceLine>
    </TraceCollapsibleTrigger>
  )
}

export type TestSuiteStatsProps = React.ComponentProps<"div"> & {
  passed?: number
  failed?: number
  skipped?: number
}

/** The counts of a suite. */
function TestSuiteStats({
  passed = 0,
  failed = 0,
  skipped = 0,
  className,
  children,
  ...props
}: TestSuiteStatsProps) {
  return (
    <div
      className={cn("ml-auto flex items-center gap-2 text-xs", className)}
      {...props}
    >
      {children ?? (
        <>
          {passed > 0 ? (
            <span className="text-green-600 dark:text-green-400">
              {passed} passed
            </span>
          ) : null}
          {failed > 0 ? (
            <span className="text-red-600 dark:text-red-400">
              {failed} failed
            </span>
          ) : null}
          {skipped > 0 ? (
            <span className="text-yellow-600 dark:text-yellow-400">
              {skipped} skipped
            </span>
          ) : null}
        </>
      )}
    </div>
  )
}

export type TestSuiteContentProps = React.ComponentProps<"div">

/** The tests of a suite. */
function TestSuiteContent({
  className,
  children,
  ...props
}: TestSuiteContentProps) {
  return (
    <TraceCollapsibleContent className={cn(className)} keepMounted {...props}>
      <Trace>{children}</Trace>
    </TraceCollapsibleContent>
  )
}

type TestContextValue = {
  name: string
  status: TestStatus
  duration?: number
}

const TestContext = React.createContext<TestContextValue>({
  name: "",
  status: "passed",
})

export type TestProps = React.ComponentProps<"span"> & {
  name: string
  status: TestStatus
  duration?: number
}

/**
 * A single test of a suite.
 *
 * A failed test that carries an error becomes a collapsible line, so the
 * error sits below the name instead of inside it.
 */
function Test({
  name,
  status,
  duration,
  className,
  children,
  ...props
}: TestProps) {
  const contextValue = React.useMemo(
    () => ({ duration, name, status }),
    [duration, name, status]
  )

  const line = (
    <TraceLine
      className={cn(className)}
      status={status === "failed" ? "error" : undefined}
      {...props}
    >
      <TraceIcon>{statusIcons[status]}</TraceIcon>
      <TraceTitle>{name}</TraceTitle>
      {duration !== undefined ? <TestDuration /> : null}
    </TraceLine>
  )

  if (!children) {
    return (
      <TestContext.Provider value={contextValue}>{line}</TestContext.Provider>
    )
  }

  return (
    <TestContext.Provider value={contextValue}>
      <TraceCollapsible defaultOpen={status === "failed"}>
        <TraceCollapsibleTrigger>{line}</TraceCollapsibleTrigger>
        <TraceCollapsibleContent keepMounted>
          {children}
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </TestContext.Provider>
  )
}

export type TestNameProps = React.ComponentProps<"span">

/** The name of a test. */
function TestName({ className, children, ...props }: TestNameProps) {
  const { name } = React.useContext(TestContext)

  return (
    <span className={cn("flex-1", className)} {...props}>
      {children ?? name}
    </span>
  )
}

export type TestDurationProps = React.ComponentProps<"span">

/** How long a test took. */
function TestDuration({ className, children, ...props }: TestDurationProps) {
  const { duration } = React.useContext(TestContext)

  if (duration === undefined) {
    return null
  }

  return (
    <span
      className={cn("ml-auto text-xs text-muted-foreground", className)}
      {...props}
    >
      {children ?? `${duration}ms`}
    </span>
  )
}

export type TestStatusProps = React.ComponentProps<"span">

/** The status of a test, as an icon. */
function TestStatus({ className, children, ...props }: TestStatusProps) {
  const { status } = React.useContext(TestContext)

  return (
    <span
      className={cn("shrink-0 text-muted-foreground", className)}
      {...props}
    >
      {children ?? statusIcons[status]}
    </span>
  )
}

export type TestErrorProps = React.ComponentProps<"div">

/** The error of a failed test. */
function TestError({ className, children, ...props }: TestErrorProps) {
  return (
    <CodeBlock size="sm" className={cn(className)} {...props}>
      <CodeBlockContent wrap className="max-h-64">
        {children}
      </CodeBlockContent>
    </CodeBlock>
  )
}

export type TestErrorMessageProps = React.ComponentProps<"span">

/**
 * The message of a failed test.
 *
 * It sits inside the code block of the error, so it is a span that breaks
 * onto its own line.
 */
function TestErrorMessage({
  className,
  children,
  ...props
}: TestErrorMessageProps) {
  return (
    <span
      className={cn("block text-sm font-medium text-destructive", className)}
      {...props}
    >
      {children}
    </span>
  )
}

export type TestErrorStackProps = React.ComponentProps<"span">

/**
 * The stack of a failed test.
 *
 * It sits inside the code block of the error, so it keeps the line breaks of
 * the stack without being a block of its own.
 */
function TestErrorStack({
  className,
  children,
  ...props
}: TestErrorStackProps) {
  return (
    <span
      className={cn(
        "mt-2 block overflow-auto font-mono text-xs whitespace-pre-wrap",
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export {
  Test,
  TestDuration,
  TestError,
  TestErrorMessage,
  TestErrorStack,
  TestName,
  TestResults,
  TestResultsContent,
  TestResultsDuration,
  TestResultsHeader,
  TestResultsProgress,
  TestResultsSummary,
  TestStatus,
  TestSuite,
  TestSuiteContent,
  TestSuiteName,
  TestSuiteStats,
}
