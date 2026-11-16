"use client"

import * as React from "react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { IconBookmark } from "@tabler/icons-react"

export type CheckpointProps = Omit<
  React.ComponentProps<typeof Marker>,
  "variant"
>

/**
 * A point in the conversation you can return to.
 */
function Checkpoint({ className, children, ...props }: CheckpointProps) {
  return (
    <Marker className={cn(className)} variant="separator" {...props}>
      <MarkerContent className="inline-flex items-center gap-2">
        {children}
      </MarkerContent>
    </Marker>
  )
}

export type CheckpointIconProps = React.ComponentProps<typeof MarkerIcon>

/**
 * The icon of a checkpoint.
 */
function CheckpointIcon({
  className,
  children,
  ...props
}: CheckpointIconProps) {
  return (
    <MarkerIcon className={cn(className)} {...props}>
      {children ?? <IconBookmark />}
    </MarkerIcon>
  )
}

export type CheckpointTriggerProps = React.ComponentProps<typeof Button> & {
  tooltip?: string
}

/**
 * The control that restores the conversation to the checkpoint.
 */
function CheckpointTrigger({
  children,
  className,
  size = "xs",
  variant = "outline",
  tooltip,
  ...props
}: CheckpointTriggerProps) {
  const button = (
    <Button
      className={cn(className)}
      size={size}
      type="button"
      variant={variant}
      {...props}
    >
      {children}
    </Button>
  )

  if (!tooltip) {
    return button
  }

  return (
    <Tooltip>
      <TooltipTrigger render={button} />
      <TooltipContent align="start" side="bottom">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  )
}

export { Checkpoint, CheckpointIcon, CheckpointTrigger }
