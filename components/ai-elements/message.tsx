"use client"

import * as React from "react"
import type { UIMessage } from "ai"
import { cn } from "cn"
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react"

import { Markdown } from "@/components/markdown"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group"
import {
  Message as MessageRoot,
  MessageContent as MessageBody,
  MessageFooter,
} from "@/components/ui/message"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type MessageContextValue = {
  from: UIMessage["role"]
}

const MessageContext = React.createContext<MessageContextValue>({
  from: "assistant",
})

export type MessageProps = React.HTMLAttributes<HTMLDivElement> & {
  from: UIMessage["role"]
}

/**
 * One turn in a thread.
 *
 * The role travels down through context so `MessageContent` knows whether it
 * has to wrap the body in a bubble for the person.
 */
function Message({ className, from, ...props }: MessageProps) {
  const contextValue = React.useMemo(() => ({ from }), [from])

  return (
    <MessageContext.Provider value={contextValue}>
      <MessageRoot
        align={from === "user" ? "end" : "start"}
        className={className}
        {...props}
      />
    </MessageContext.Provider>
  )
}

export type MessageContentProps = React.HTMLAttributes<HTMLDivElement>

/**
 * The body of a turn.
 *
 * The person's turn is wrapped in a bubble, the agent's turn is rendered as
 * is so markdown and tool output keep their own layout.
 */
function MessageContent({
  className,
  children,
  ...props
}: MessageContentProps) {
  const { from } = React.useContext(MessageContext)

  return (
    <MessageBody className={className} {...props}>
      {from === "user" ? (
        <Bubble align="end" variant="muted">
          <BubbleContent>{children}</BubbleContent>
        </Bubble>
      ) : (
        children
      )}
    </MessageBody>
  )
}

export type MessageActionsProps = React.ComponentProps<"div">

/** The action row under a turn. */
function MessageActions({
  className,
  children,
  ...props
}: MessageActionsProps) {
  return (
    <MessageFooter className={className} {...props}>
      {children}
    </MessageFooter>
  )
}

export type MessageActionProps = React.ComponentProps<typeof Button> & {
  tooltip?: string
  label?: string
}

/**
 * A single action under a turn.
 *
 * The label is the accessible name of the button and, when there is no
 * tooltip, the tooltip text as well.
 */
function MessageAction({
  tooltip,
  label,
  children,
  className,
  variant = "ghost",
  size = "icon-sm",
  ...props
}: MessageActionProps) {
  const content = tooltip ?? label
  const accessibleLabel = label ?? tooltip

  if (!content) {
    return (
      <Button
        className={className}
        size={size}
        type="button"
        variant={variant}
        {...props}
      >
        {children}
      </Button>
    )
  }

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            aria-label={accessibleLabel}
            className={className}
            size={size}
            type="button"
            variant={variant}
            {...props}
          />
        }
      >
        {children}
      </TooltipTrigger>
      <TooltipContent>
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  )
}

export type MessageResponseProps = React.ComponentProps<typeof Markdown>

/** The agent's reply, rendered as markdown. */
function MessageResponse({ className, ...props }: MessageResponseProps) {
  return (
    <Markdown
      className={cn(
        "size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        className
      )}
      {...props}
    />
  )
}

export type MessageToolbarProps = React.ComponentProps<"div">

/** A row that spans the turn, for example to hold branches and a timestamp. */
function MessageToolbar({
  className,
  children,
  ...props
}: MessageToolbarProps) {
  return (
    <div
      className={cn(
        "mt-4 flex w-full items-center justify-between gap-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

type MessageBranchContextValue = {
  currentBranch: number
  totalBranches: number
  goToPrevious: () => void
  goToNext: () => void
  branches: React.ReactElement[]
  setBranches: (branches: React.ReactElement[]) => void
}

const MessageBranchContext =
  React.createContext<MessageBranchContextValue | null>(null)

function useMessageBranch() {
  const context = React.useContext(MessageBranchContext)

  if (!context) {
    throw new Error(
      "MessageBranch components must be used within MessageBranch"
    )
  }

  return context
}

export type MessageBranchProps = React.HTMLAttributes<HTMLDivElement> & {
  defaultBranch?: number
  onBranchChange?: (branchIndex: number) => void
}

/** Holds the alternative versions of a turn and the one on screen. */
function MessageBranch({
  defaultBranch = 0,
  onBranchChange,
  className,
  ...props
}: MessageBranchProps) {
  const [currentBranch, setCurrentBranch] = React.useState(defaultBranch)
  const [branches, setBranches] = React.useState<React.ReactElement[]>([])

  const handleBranchChange = React.useCallback(
    (newBranch: number) => {
      setCurrentBranch(newBranch)
      onBranchChange?.(newBranch)
    },
    [onBranchChange]
  )

  const goToPrevious = React.useCallback(() => {
    const newBranch =
      currentBranch > 0 ? currentBranch - 1 : branches.length - 1
    handleBranchChange(newBranch)
  }, [currentBranch, branches.length, handleBranchChange])

  const goToNext = React.useCallback(() => {
    const newBranch =
      currentBranch < branches.length - 1 ? currentBranch + 1 : 0
    handleBranchChange(newBranch)
  }, [currentBranch, branches.length, handleBranchChange])

  const contextValue = React.useMemo<MessageBranchContextValue>(
    () => ({
      branches,
      currentBranch,
      goToNext,
      goToPrevious,
      setBranches,
      totalBranches: branches.length,
    }),
    [branches, currentBranch, goToNext, goToPrevious]
  )

  return (
    <MessageBranchContext.Provider value={contextValue}>
      <div
        className={cn("grid w-full gap-2 [&>div]:pb-0", className)}
        {...props}
      />
    </MessageBranchContext.Provider>
  )
}

export type MessageBranchContentProps = React.HTMLAttributes<HTMLDivElement>

/** The branches of a turn. Only the selected one is visible. */
function MessageBranchContent({
  children,
  ...props
}: MessageBranchContentProps) {
  const { currentBranch, setBranches, branches } = useMessageBranch()
  const childrenArray = React.useMemo<React.ReactElement[]>(
    () =>
      (Array.isArray(children) ? children : [children]) as React.ReactElement[],
    [children]
  )

  React.useEffect(() => {
    if (branches.length !== childrenArray.length) {
      setBranches(childrenArray)
    }
  }, [childrenArray, branches, setBranches])

  return childrenArray.map((branch, index) => (
    <div
      className={cn(
        "grid gap-2 overflow-hidden [&>div]:pb-0",
        index === currentBranch ? "block" : "hidden"
      )}
      key={branch.key}
      {...props}
    >
      {branch}
    </div>
  ))
}

export type MessageBranchSelectorProps = React.ComponentProps<
  typeof ButtonGroup
>

/** The controls that move between branches. */
function MessageBranchSelector({
  className,
  ...props
}: MessageBranchSelectorProps) {
  const { totalBranches } = useMessageBranch()

  if (totalBranches <= 1) {
    return null
  }

  return (
    <ButtonGroup
      className={cn(
        "[&>*:not(:first-child)]:rounded-l-md [&>*:not(:last-child)]:rounded-r-md",
        className
      )}
      orientation="horizontal"
      {...props}
    />
  )
}

export type MessageBranchPreviousProps = React.ComponentProps<typeof Button>

/** Moves to the previous branch. */
function MessageBranchPrevious({
  children,
  ...props
}: MessageBranchPreviousProps) {
  const { goToPrevious, totalBranches } = useMessageBranch()

  return (
    <Button
      aria-label="Previous branch"
      disabled={totalBranches <= 1}
      onClick={goToPrevious}
      size="icon-sm"
      type="button"
      variant="ghost"
      {...props}
    >
      {children ?? <IconChevronLeft />}
    </Button>
  )
}

export type MessageBranchNextProps = React.ComponentProps<typeof Button>

/** Moves to the next branch. */
function MessageBranchNext({ children, ...props }: MessageBranchNextProps) {
  const { goToNext, totalBranches } = useMessageBranch()

  return (
    <Button
      aria-label="Next branch"
      disabled={totalBranches <= 1}
      onClick={goToNext}
      size="icon-sm"
      type="button"
      variant="ghost"
      {...props}
    >
      {children ?? <IconChevronRight />}
    </Button>
  )
}

export type MessageBranchPageProps = React.HTMLAttributes<HTMLSpanElement>

/** Reads "2 of 3" for the branch on screen. */
function MessageBranchPage({ className, ...props }: MessageBranchPageProps) {
  const { currentBranch, totalBranches } = useMessageBranch()

  return (
    <ButtonGroupText
      className={cn(
        "border-none bg-transparent text-muted-foreground shadow-none",
        className
      )}
      {...props}
    >
      {currentBranch + 1} of {totalBranches}
    </ButtonGroupText>
  )
}

export {
  Message,
  MessageAction,
  MessageActions,
  MessageBranch,
  MessageBranchContent,
  MessageBranchNext,
  MessageBranchPage,
  MessageBranchPrevious,
  MessageBranchSelector,
  MessageContent,
  MessageResponse,
  MessageToolbar,
}
