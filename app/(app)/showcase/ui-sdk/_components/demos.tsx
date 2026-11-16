"use client"

import * as React from "react"

import { IconFolder, IconFolderOpen, IconFile } from "@tabler/icons-react"

import { ComposedSegmentedControl } from "@/components/composed/segmented-control"
import { ComposedRating } from "@/components/composed/rating"
import {
  ComposedTree,
  ComposedTreeGroup,
  ComposedTreeItem,
} from "@/components/composed/tree"
import {
  DataGridCell,
  DataGridColumnHeader,
  DataGridRoot,
  DataGridRow,
} from "@/components/primitives/data-grid"

const VIEW_MODES = [
  { value: "list", label: "List" },
  { value: "grid", label: "Grid" },
  { value: "board", label: "Board" },
]

const GRID_COLUMNS = ["Service", "Status", "Owner"]
const GRID_ROWS = [
  ["api-gateway", "Deployed", "Ada Lovelace"],
  ["billing-worker", "Queued", "Grace Hopper"],
  ["web-console", "Failed", "Alan Turing"],
]

export function SegmentedControlDemo() {
  const [view, setView] = React.useState("list")

  return (
    <div className="flex flex-col gap-3">
      <ComposedSegmentedControl
        items={VIEW_MODES}
        value={view}
        onValueChange={(next) => setView(next ?? "list")}
        aria-label="View mode"
      />
      <p className="text-sm text-muted-foreground">
        Selected view:{" "}
        <span className="font-medium text-foreground">{view}</span>
      </p>
    </div>
  )
}

export function RatingDemo() {
  const [rating, setRating] = React.useState(3)

  return (
    <div className="flex flex-col gap-3">
      <ComposedRating
        value={rating}
        onValueChange={(next) => setRating(next ?? 0)}
        label="Rate this service"
      />
      <p className="text-sm text-muted-foreground">
        Rating: <span className="font-medium text-foreground">{rating}</span> of
        5
      </p>
    </div>
  )
}

type FileNode = {
  value: string
  label: string
  children?: FileNode[]
}

const FILES: FileNode[] = [
  {
    value: "app",
    label: "app",
    children: [
      { value: "app/layout.tsx", label: "layout.tsx" },
      { value: "app/page.tsx", label: "page.tsx" },
      {
        value: "app/settings",
        label: "settings",
        children: [{ value: "app/settings/page.tsx", label: "page.tsx" }],
      },
    ],
  },
  {
    value: "components",
    label: "components",
    children: [
      { value: "components/button.tsx", label: "button.tsx" },
      { value: "components/card.tsx", label: "card.tsx" },
    ],
  },
  { value: "package.json", label: "package.json" },
]

function FileNodes({ items }: { items: FileNode[] }) {
  return (
    <>
      {items.map((item) => (
        <ComposedTreeItem
          key={item.value}
          value={item.value}
          branch={item.children ? true : undefined}
          label={item.label}
          text={item.label}
          icon={
            item.children ? (
              <>
                <IconFolder
                  aria-hidden="true"
                  className="size-4 shrink-0 text-muted-foreground"
                />
                <IconFolderOpen
                  aria-hidden="true"
                  className="hidden size-4 shrink-0 text-muted-foreground group-data-[expanded]/tree-item:block"
                />
              </>
            ) : (
              <IconFile
                aria-hidden="true"
                className="size-4 shrink-0 text-muted-foreground"
              />
            )
          }
        >
          {item.children ? (
            <ComposedTreeGroup>
              <FileNodes items={item.children} />
            </ComposedTreeGroup>
          ) : null}
        </ComposedTreeItem>
      ))}
    </>
  )
}

export function TreeDemo() {
  return (
    <ComposedTree label="Project files" defaultExpanded={["app"]}>
      <FileNodes items={FILES} />
    </ComposedTree>
  )
}

export function DataGridDemo() {
  return (
    <DataGridRoot
      rows={GRID_ROWS.length}
      columns={GRID_COLUMNS.length}
      aria-label="Services"
      className="grid w-full grid-cols-[repeat(3,minmax(0,1fr))] text-sm"
    >
      <DataGridRow className="col-span-3 grid grid-cols-[repeat(3,minmax(0,1fr))] border-b">
        {GRID_COLUMNS.map((column) => (
          <DataGridColumnHeader
            key={column}
            className="bg-muted/50 px-3 py-2 text-left font-medium"
          >
            {column}
          </DataGridColumnHeader>
        ))}
      </DataGridRow>
      {GRID_ROWS.map((row, rowIndex) => (
        <DataGridRow
          key={row[0]}
          className="col-span-3 grid grid-cols-[repeat(3,minmax(0,1fr))] border-b last:border-0"
        >
          {row.map((value, colIndex) => (
            <DataGridCell
              key={value}
              id={`${rowIndex + 1}:${colIndex + 1}`}
              row={rowIndex}
              col={colIndex}
              className="border-r px-3 py-2 last:border-r-0 data-selected:bg-muted"
            >
              {value}
            </DataGridCell>
          ))}
        </DataGridRow>
      ))}
    </DataGridRoot>
  )
}
