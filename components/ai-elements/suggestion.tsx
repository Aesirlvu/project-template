"use client"

import * as React from "react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"

export type SuggestionsProps = React.ComponentProps<"div">

export function Suggestions({
  className,
  children,
  ...props
}: SuggestionsProps) {
  return (
    <div
      className={cn(
        "flex scroll-fade-x scrollbar-none gap-2 overflow-x-auto overscroll-x-contain",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export type SuggestionProps = Omit<
  React.ComponentProps<typeof Button>,
  "onClick"
> & {
  suggestion: string
  onClick?: (suggestion: string) => void
}

export function Suggestion({
  suggestion,
  onClick,
  className,
  variant = "outline",
  size = "sm",
  children,
  ...props
}: SuggestionProps) {
  const handleClick = React.useCallback(() => {
    onClick?.(suggestion)
  }, [onClick, suggestion])

  return (
    <Button
      className={cn("shrink-0", className)}
      onClick={handleClick}
      size={size}
      type="button"
      variant={variant}
      {...props}
    >
      {children || suggestion}
    </Button>
  )
}
