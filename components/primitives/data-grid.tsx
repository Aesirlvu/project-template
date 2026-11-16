"use client"

import { createParts } from "@ui-sdk/react/primitive"

import { dataGrid } from "./data-grid.primitive"

export const {
  Root: DataGridRoot,
  Row: DataGridRow,
  ColumnHeader: DataGridColumnHeader,
  Cell: DataGridCell,
} = createParts(dataGrid, {
  root: "div",
  row: "div",
  columnHeader: "div",
  cell: "div",
})
