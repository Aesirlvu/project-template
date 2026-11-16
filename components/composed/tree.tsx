"use client"

import * as React from "react"

import {
  Tree as TreePrimitive,
  TreeGroup as TreeGroupPrimitive,
  TreeItem as TreeItemPrimitive,
  TreeItemIndicator as TreeItemIndicatorPrimitive,
  TreeItemLabel as TreeItemLabelPrimitive,
} from "@ui-sdk/react/tree"

import { IconChevronRight, IconFolder } from "@tabler/icons-react"

import { cn } from "cn"

export type ComposedTreeProps = React.ComponentProps<typeof TreePrimitive> & {
  label?: string
}

export type ComposedTreeItemProps = Omit<
  React.ComponentProps<typeof TreeItemPrimitive>,
  "children"
> & {
  icon?: React.ReactNode
  text?: React.ReactNode
  children?: React.ReactNode
}

/**
 * A file tree. ui-sdk owns the roving focus, the branch expansion and the
 * aria roles; the row is styled from the tree item label, because a
 * background on the item would cover its own children.
 */
export function ComposedTree({
  label = "Tree",
  className,
  ...props
}: ComposedTreeProps) {
  return (
    <TreePrimitive
      data-slot="tree"
      aria-label={label}
      className={cn("flex w-full flex-col gap-0.5", className)}
      {...props}
    />
  )
}

export function ComposedTreeItem({
  icon,
  text,
  children,
  ...props
}: ComposedTreeItemProps) {
  return (
    <TreeItemPrimitive data-slot="tree-item" {...props}>
      <TreeItemLabelPrimitive
        data-slot="tree-label"
        className={cn(
          "flex min-h-8 cursor-pointer items-center gap-2 rounded-sm px-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring",
          "focus-visible:ring-2 focus-visible:outline-none",
          "data-[selected]:bg-accent data-[selected]:text-accent-foreground",
          "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
        )}
      >
        <TreeItemIndicatorPrimitive
          data-slot="tree-indicator"
          className={cn(
            "inline-flex size-4 shrink-0 items-center justify-center text-muted-foreground transition-transform",
            "data-[expanded]:rotate-90"
          )}
        >
          <IconChevronRight aria-hidden="true" className="size-3.5" />
        </TreeItemIndicatorPrimitive>
        {icon}
        {text ? <span className="truncate">{text}</span> : null}
      </TreeItemLabelPrimitive>
      {children}
    </TreeItemPrimitive>
  )
}

export function ComposedTreeGroup({
  className,
  ...props
}: React.ComponentProps<typeof TreeGroupPrimitive>) {
  return (
    <TreeGroupPrimitive
      data-slot="tree-group"
      className={cn("ml-4 flex flex-col gap-0.5", className)}
      {...props}
    />
  )
}

export function ComposedTreeFolderIcon() {
  return (
    <IconFolder
      aria-hidden="true"
      className="size-4 shrink-0 text-muted-foreground"
    />
  )
}
