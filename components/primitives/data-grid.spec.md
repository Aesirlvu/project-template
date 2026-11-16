# Data grid — APG spec

Pattern: WAI-ARIA APG grid pattern (`role="grid"`), with a spreadsheet-style
rectangle selection layered on top.

Roles: the root is `grid`, the header row is `row` inside the grid, each header
cell is `columnheader`, each body cell is `gridcell`, and the row that owns the
cells is `row`.

Focus: the grid keeps a single tab stop. Before the grid is entered the first
cell that is not disabled holds it; once inside, only the active cell has
`tabindex="0"` and every other cell has `tabindex="-1"`. Arrow keys move the
active cell by row and column, Home and End reach the ends of the active row,
Control plus Home or End reach the ends of the grid, and Page Up and Page Down
move by the page size.

Selection: the active cell is always part of the selection. Shift plus an arrow
key extends the rectangle from the anchor cell to the new cell. Escape drops
the range and keeps only the active cell. `mod+a` (Control plus A on Windows and
Linux, Command plus A on macOS) selects every cell.

Announcement: a keyboard-driven range change is announced with the rectangle
bounds, which `createCellRange` provides in English unless the primitive passes
its own `message`.

Roving focus inside a cell: a cell that holds an editable control keeps that
control's own focus behaviour, and the grid only moves the active cell when
the event did not originate in a nested control.
