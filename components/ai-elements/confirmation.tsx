"use client"

import * as React from "react"
import { cn } from "cn"

import type { ToolUIPart } from "ai"

import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"

export type ToolUIPartApproval =
  | {
      id: string
      approved?: never
      reason?: never
    }
  | {
      id: string
      approved: boolean
      reason?: string
    }
  | {
      id: string
      approved: true
      reason?: string
    }
  | {
      id: string
      approved: false
      reason?: string
    }
  | undefined

interface ConfirmationContextValue {
  approval: ToolUIPartApproval
  state: ToolUIPart["state"]
}

const ConfirmationContext =
  React.createContext<ConfirmationContextValue | null>(null)

function useConfirmation() {
  const context = React.useContext(ConfirmationContext)

  if (!context) {
    throw new Error("Confirmation components must be used within Confirmation")
  }

  return context
}

export type ConfirmationProps = React.ComponentProps<typeof Item> & {
  approval?: ToolUIPartApproval
  state: ToolUIPart["state"]
}

export function Confirmation({
  className,
  approval,
  state,
  ...props
}: ConfirmationProps) {
  const contextValue = React.useMemo(
    () => ({ approval, state }),
    [approval, state]
  )

  if (!approval || state === "input-streaming" || state === "input-available") {
    return null
  }

  return (
    <ConfirmationContext.Provider value={contextValue}>
      <Item
        variant="outline"
        size="sm"
        className={cn("flex-col items-stretch gap-2", className)}
        {...props}
      />
    </ConfirmationContext.Provider>
  )
}

export type ConfirmationTitleProps = React.ComponentProps<
  typeof ItemContent
> & {
  /** Title of the request. Falls back to the children. */
  title?: React.ReactNode
  /** Optional line under the title. */
  description?: React.ReactNode
}

export function ConfirmationTitle({
  className,
  children,
  title,
  description,
  ...props
}: ConfirmationTitleProps) {
  return (
    <ItemContent className={className} {...props}>
      <ItemTitle>{title ?? children}</ItemTitle>
      {description ? <ItemDescription>{description}</ItemDescription> : null}
    </ItemContent>
  )
}

export interface ConfirmationRequestProps {
  children?: React.ReactNode
}

export function ConfirmationRequest({ children }: ConfirmationRequestProps) {
  const { state } = useConfirmation()

  // Only show when approval is requested
  if (state !== "approval-requested") {
    return null
  }

  return children
}

export interface ConfirmationAcceptedProps {
  children?: React.ReactNode
}

export function ConfirmationAccepted({ children }: ConfirmationAcceptedProps) {
  const { approval, state } = useConfirmation()

  // Only show when approved and in response states
  if (
    !approval?.approved ||
    (state !== "approval-responded" &&
      state !== "output-denied" &&
      state !== "output-available")
  ) {
    return null
  }

  return children
}

export interface ConfirmationRejectedProps {
  children?: React.ReactNode
}

export function ConfirmationRejected({ children }: ConfirmationRejectedProps) {
  const { approval, state } = useConfirmation()

  // Only show when rejected and in response states
  if (
    approval?.approved !== false ||
    (state !== "approval-responded" &&
      state !== "output-denied" &&
      state !== "output-available")
  ) {
    return null
  }

  return children
}

export type ConfirmationActionsProps = React.ComponentProps<typeof ItemActions>

export function ConfirmationActions({
  className,
  ...props
}: ConfirmationActionsProps) {
  const { state } = useConfirmation()

  // Only show when approval is requested
  if (state !== "approval-requested") {
    return null
  }

  return (
    <ItemActions className={cn("justify-end self-end", className)} {...props} />
  )
}

export type ConfirmationActionProps = React.ComponentProps<typeof Button>

export function ConfirmationAction(props: ConfirmationActionProps) {
  return <Button size="sm" type="button" {...props} />
}
