"use client"

import * as React from "react"
import type { UIMessage } from "ai"
import { cn } from "cn"
import { IconArrowDown, IconDownload } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"

export type ConversationProps = React.ComponentProps<
  typeof MessageScrollerProvider
> & {
  className?: string
}

/**
 * The thread of a conversation.
 *
 * Wraps the scroller in a provider so the thread follows the reply while the
 * person stays at the live edge, and marks the region as a log for assistive
 * technology.
 */
function Conversation({
  className,
  children,
  autoScroll = true,
  ...props
}: ConversationProps) {
  return (
    <MessageScrollerProvider autoScroll={autoScroll} {...props}>
      <MessageScroller className={cn("relative min-h-0 w-full", className)}>
        {children}
      </MessageScroller>
    </MessageScrollerProvider>
  )
}

export type ConversationContentProps = React.ComponentProps<
  typeof MessageScrollerContent
> & {
  className?: string
}

/**
 * The scrollable body of the thread.
 *
 * Every turn lives inside it as a scroller item, and the person's turn is
 * marked as the scroll anchor so the reply settles under the question.
 */
function ConversationContent({
  className,
  children,
  ...props
}: ConversationContentProps) {
  return (
    <MessageScrollerViewport className="min-h-0 flex-1">
      <MessageScrollerContent className={cn("gap-6 p-4", className)} {...props}>
        {children}
      </MessageScrollerContent>
    </MessageScrollerViewport>
  )
}

export type ConversationScrollButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "render" | "style"
> & {
  style?: React.CSSProperties
}

/**
 * The button that jumps back to the live edge of the thread.
 *
 * It only shows while the person is scrolled away from the latest turn.
 */
function ConversationScrollButton({
  className,
  children,
  variant = "outline",
  size = "icon",
  ...props
}: ConversationScrollButtonProps) {
  return (
    <MessageScrollerButton
      className={cn(className)}
      size={size}
      variant={variant}
      {...props}
    >
      {children ?? (
        <>
          <IconArrowDown />
          <span className="sr-only">Scroll to end</span>
        </>
      )}
    </MessageScrollerButton>
  )
}

export type ConversationEmptyStateProps = React.ComponentProps<"div"> & {
  title?: string
  description?: string
  icon?: React.ReactNode
}

/** The placeholder shown while the thread has no turns yet. */
function ConversationEmptyState({
  className,
  title = "No messages yet",
  description = "Start a conversation to see messages here",
  icon,
  children,
  ...props
}: ConversationEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex size-full flex-col items-center justify-center gap-3 p-8 text-center",
        className
      )}
      {...props}
    >
      {children ?? (
        <>
          {icon ? <div className="text-muted-foreground">{icon}</div> : null}
          <div className="space-y-1">
            <h3 className="text-sm font-medium">{title}</h3>
            {description ? (
              <p className="text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
        </>
      )}
    </div>
  )
}

/**
 * Renders the text of a message.
 *
 * Only text parts carry prose; every other part of the message is tool output
 * or reasoning and is rendered by its own element.
 */
function getMessageText(message: Pick<UIMessage, "parts">): string {
  return message.parts.reduce(
    (text, part) => (part.type === "text" ? text + part.text : text),
    ""
  )
}

/**
 * Turns a thread into markdown, one paragraph per message.
 *
 * The default format writes the role in bold before the text of the message.
 */
export function messagesToMarkdown(
  messages: Pick<UIMessage, "parts" | "role">[],
  formatMessage: (
    message: Pick<UIMessage, "parts" | "role">,
    index: number
  ) => string = defaultFormatMessage
): string {
  return messages
    .map((message, index) => formatMessage(message, index))
    .join("\n\n")
}

function defaultFormatMessage(
  message: Pick<UIMessage, "parts" | "role">
): string {
  const roleLabel = message.role.charAt(0).toUpperCase() + message.role.slice(1)
  return `**${roleLabel}:** ${getMessageText(message)}`
}

export type ConversationDownloadProps = Omit<
  React.ComponentProps<typeof Button>,
  "onClick"
> & {
  messages: Pick<UIMessage, "parts" | "role">[]
  filename?: string
  formatMessage?: (
    message: Pick<UIMessage, "parts" | "role">,
    index: number
  ) => string
}

/** Downloads the thread as a markdown file. */
function ConversationDownload({
  messages,
  filename = "conversation.md",
  formatMessage = defaultFormatMessage,
  className,
  children,
  ...props
}: ConversationDownloadProps) {
  const handleDownload = React.useCallback(() => {
    const markdown = messagesToMarkdown(messages, formatMessage)
    const blob = new Blob([markdown], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.append(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }, [messages, filename, formatMessage])

  return (
    <Button
      aria-label="Download conversation"
      className={cn("absolute top-4 right-4", className)}
      onClick={handleDownload}
      size="icon"
      type="button"
      variant="outline"
      {...props}
    >
      {children ?? <IconDownload />}
    </Button>
  )
}

export {
  Conversation,
  ConversationContent,
  ConversationDownload,
  ConversationEmptyState,
  ConversationScrollButton,
}
