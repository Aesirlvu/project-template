import {
  byCell,
  byCellRange,
  createCellRange,
  createChange,
  createGridFocus,
  definePrimitive,
  selects,
  type GridCell,
} from "@ui-sdk/core"

export type DataGridOptions = {
  rows: number
  columns: number
}

export type DataGridCell = {
  id: string
  row: number
  col: number
}

export type DataGridState = {
  active: GridCell | null
  range: { anchor: GridCell; end: GridCell } | null
  rowCount: number
  colCount: number
}

export const dataGrid = definePrimitive({
  name: "data-grid",
  options: {
    rows: "number",
    columns: "number",
  },
  state: (options: DataGridOptions) => ({
    active: null as GridCell | null,
    range: null as { anchor: GridCell; end: GridCell } | null,
    rowCount: options.rows,
    colCount: options.columns,
  }),
  api: (context) => {
    const change = createChange(context)
    const grid = createGridFocus(context, {
      key: "active",
      rows: () => context.options().rows,
      cols: () => context.options().columns,
    })
    const range = createCellRange(context, {
      key: "range",
      grid,
      rows: () => context.options().rows,
      cols: () => context.options().columns,
      set: (next, details) => {
        void change("range", next, {
          reason: details.reason,
          event: details.event,
        })
        return true
      },
    })

    return { grid, range }
  },
  slots: (slot) => ({
    root: slot({
      role: "grid",
      keys: { none: "Focus stays on a cell, whose keydown handles them." },
      attrs: (state) => ({
        "aria-rowcount": String(state.rowCount),
        "aria-colcount": String(state.colCount),
      }),
    }),
    row: slot({
      role: "row",
    }),
    columnHeader: slot({
      role: "columnheader",
    }),
    cell: slot<DataGridCell>({
      props: { id: "string", row: "number", col: "number" },
      role: "gridcell",
      focus: "roving",
      selects: selects({ active: byCell, range: byCellRange }),
      keys: [
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "Home",
        "End",
        "mod+Home",
        "mod+End",
        "PageUp",
        "PageDown",
        "shift+ArrowUp",
        "shift+ArrowDown",
        "shift+ArrowLeft",
        "shift+ArrowRight",
        "shift+Home",
        "shift+End",
        "shift+ ",
        "mod+ ",
        "mod+a",
        "Escape",
      ],
      attrs: (state, { props, api }) => ({
        tabindex: api.grid.tabIndex(state, props),
        ...api.range.cellAttrs(state, props),
      }),
      on: {
        keydown: (event, { api }) => api.range.keydown(event),
        pointerdown: (event, { api, props }) =>
          api.range.pointerdown(event, props),
      },
      bind: (el, { api, props }) => api.range.bind(el, props),
    }),
  }),
})
