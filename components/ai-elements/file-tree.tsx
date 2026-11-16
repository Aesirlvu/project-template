"use client"

import * as React from "react"
import { cn } from "cn"
import {
  IconChevronRight,
  IconFile,
  IconFolder,
  IconFolderOpen,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

interface FileTreeContextType {
  expandedPaths: Set<string>
  togglePath: (path: string) => void
  selectedPath?: string
  onSelect?: (path: string) => void
}

// Default noop for context default value
function noop() {}

const FileTreeContext = React.createContext<FileTreeContextType>({
  expandedPaths: new Set(),
  togglePath: noop,
})

export type FileTreeProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onSelect"
> & {
  expanded?: Set<string>
  defaultExpanded?: Set<string>
  selectedPath?: string
  onSelect?: (path: string) => void
  onExpandedChange?: (expanded: Set<string>) => void
}

export function FileTree({
  expanded: controlledExpanded,
  defaultExpanded = new Set(),
  selectedPath,
  onSelect,
  onExpandedChange,
  className,
  children,
  ...props
}: FileTreeProps) {
  const [internalExpanded, setInternalExpanded] =
    React.useState(defaultExpanded)
  const expandedPaths = controlledExpanded ?? internalExpanded

  const togglePath = React.useCallback(
    (path: string) => {
      const newExpanded = new Set(expandedPaths)
      if (newExpanded.has(path)) {
        newExpanded.delete(path)
      } else {
        newExpanded.add(path)
      }
      setInternalExpanded(newExpanded)
      onExpandedChange?.(newExpanded)
    },
    [expandedPaths, onExpandedChange]
  )

  const contextValue = React.useMemo(
    () => ({ expandedPaths, onSelect, selectedPath, togglePath }),
    [expandedPaths, onSelect, selectedPath, togglePath]
  )

  return (
    <FileTreeContext.Provider value={contextValue}>
      <div
        className={cn(
          "rounded-lg border bg-background font-mono text-sm",
          className
        )}
        role="tree"
        {...props}
      >
        <div className="p-2">{children}</div>
      </div>
    </FileTreeContext.Provider>
  )
}

export type FileTreeIconProps = React.HTMLAttributes<HTMLSpanElement>

export function FileTreeIcon({
  className,
  children,
  ...props
}: FileTreeIconProps) {
  return (
    <span className={cn("shrink-0", className)} {...props}>
      {children}
    </span>
  )
}

export type FileTreeNameProps = React.HTMLAttributes<HTMLSpanElement>

export function FileTreeName({
  className,
  children,
  ...props
}: FileTreeNameProps) {
  return (
    <span className={cn("truncate", className)} {...props}>
      {children}
    </span>
  )
}

export type FileTreeFolderProps = React.HTMLAttributes<HTMLDivElement> & {
  path: string
  name: string
}

export function FileTreeFolder({
  path,
  name,
  className,
  children,
  ...props
}: FileTreeFolderProps) {
  const { expandedPaths, togglePath, selectedPath } =
    React.useContext(FileTreeContext)
  const isExpanded = expandedPaths.has(path)
  const isSelected = selectedPath === path

  const handleOpenChange = React.useCallback(() => {
    togglePath(path)
  }, [togglePath, path])

  return (
    <Collapsible onOpenChange={handleOpenChange} open={isExpanded}>
      <div
        className={cn("rounded", className)}
        role="treeitem"
        aria-expanded={isExpanded}
        aria-selected={isSelected}
        {...props}
      >
        <CollapsibleTrigger
          render={
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "w-full justify-start font-normal aria-expanded:bg-transparent aria-expanded:hover:bg-muted dark:aria-expanded:hover:bg-muted/50",
                isSelected && "bg-accent text-accent-foreground"
              )}
            />
          }
        >
          <IconChevronRight
            aria-hidden="true"
            className={cn("transition-transform", isExpanded && "rotate-90")}
          />
          <FileTreeIcon>
            {isExpanded ? (
              <IconFolderOpen
                aria-hidden="true"
                className="size-4 text-blue-500"
              />
            ) : (
              <IconFolder aria-hidden="true" className="size-4 text-blue-500" />
            )}
          </FileTreeIcon>
          <FileTreeName>{name}</FileTreeName>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="ml-4 flex flex-col">{children}</div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}

export type FileTreeFileProps = React.HTMLAttributes<HTMLDivElement> & {
  path: string
  name: string
  icon?: React.ReactNode
}

export function FileTreeFile({
  path,
  name,
  icon,
  className,
  children,
  ...props
}: FileTreeFileProps) {
  const { selectedPath, onSelect } = React.useContext(FileTreeContext)
  const isSelected = selectedPath === path

  const handleClick = React.useCallback(() => {
    onSelect?.(path)
  }, [onSelect, path])

  return (
    <div
      className={cn("flex items-center gap-1", className)}
      role="treeitem"
      aria-selected={isSelected}
      {...props}
    >
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "w-full justify-start font-normal",
          isSelected && "bg-accent text-accent-foreground"
        )}
        aria-current={isSelected ? "true" : undefined}
        onClick={handleClick}
      >
        {/* Spacer for alignment with the folder chevron. */}
        <span className="size-4 shrink-0" />
        <FileTreeIcon>
          {icon ?? (
            <IconFile
              aria-hidden="true"
              className="size-4 text-muted-foreground"
            />
          )}
        </FileTreeIcon>
        <FileTreeName>{name}</FileTreeName>
      </Button>
      {children}
    </div>
  )
}

export type FileTreeActionsProps = React.HTMLAttributes<HTMLDivElement>

function stopPropagation(event: React.SyntheticEvent) {
  event.stopPropagation()
}

export function FileTreeActions({
  className,
  children,
  ...props
}: FileTreeActionsProps) {
  return (
    <div
      className={cn("ml-auto flex items-center gap-1", className)}
      onClick={stopPropagation}
      onKeyDown={stopPropagation}
      role="group"
      {...props}
    >
      {children}
    </div>
  )
}
