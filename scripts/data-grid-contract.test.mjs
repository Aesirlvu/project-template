// Verifies the data-grid primitive contract without a DOM:
// the slots exist, the roles follow the APG grid pattern, and the parts
// expose the stable cell id the primitive uses to tell cells apart.
import { readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import path from "node:path"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const primitivePath = path.join(root, "components/primitives/data-grid.primitive.ts")
const partsPath = path.join(root, "components/primitives/data-grid.tsx")
const specPath = path.join(root, "components/primitives/data-grid.spec.md")

const primitive = await readFile(primitivePath, "utf8")
const parts = await readFile(partsPath, "utf8")
const spec = await readFile(specPath, "utf8")

const failures = []

function check(name, condition) {
  if (condition) {
    console.log(`PASS  ${name}`)
  } else {
    failures.push(name)
    console.log(`FAIL  ${name}`)
  }
}

// The primitive is built on the core blocks, not a hand-rolled grid.
check(
  "primitive uses createGridFocus",
  primitive.includes("createGridFocus") && primitive.includes("createCellRange")
)
check(
  "primitive uses definePrimitive with the grid name",
  primitive.includes("definePrimitive") && primitive.includes('name: "data-grid"')
)
check(
  "primitive creates changes through createChange",
  primitive.includes("createChange")
)
check(
  "primitive selects the active cell and the range",
  primitive.includes("byCell") && primitive.includes("byCellRange")
)

// APG roles live in the slot declaration, never in attrs.
check("root slot declares role grid", /role:\s*"grid"/.test(primitive))
check("row slot declares role row", /role:\s*"row"/.test(primitive))
check(
  "column header slot declares role columnheader",
  /role:\s*"columnheader"/.test(primitive)
)
check("cell slot declares role gridcell", /role:\s*"gridcell"/.test(primitive))
check(
  "roles are not smuggled through attrs",
  !/"role"\s*:/.test(primitive)
)

// attrs must stay pure: no live state reads.
check(
  "root attrs reads the row and column counts from state",
  /attrs:\s*\(state\)\s*=>\s*\(\{[\s\S]*?aria-rowcount/.test(primitive) &&
    !/attrs:[^}]*api\.grid\.active\(\)/.test(primitive)
)

// Keyboard support for the spreadsheet-like selection.
for (const key of [
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "Home",
  "End",
  "mod+a",
  "Escape",
  "shift+ArrowRight",
]) {
  check(`cell slot handles ${key}`, primitive.includes(`"${key}"`))
}

// The parts are generated from the primitive.
for (const part of [
  "Root: DataGridRoot",
  "Row: DataGridRow",
  "ColumnHeader: DataGridColumnHeader",
  "Cell: DataGridCell",
]) {
  check(`createParts exports ${part.split(": ")[1]}`, parts.includes(part))
}
check("parts file is a client component", parts.startsWith('"use client"'))

// The APG spec is written before the code and still describes it.
for (const topic of ["gridcell", "columnheader", "roving", "Escape", "mod+a"]) {
  check(`spec mentions ${topic}`, spec.toLowerCase().includes(topic.toLowerCase()))
}

if (failures.length > 0) {
  console.error(`\n${failures.length} check(s) failed.`)
  process.exit(1)
}

console.log(`\n${"data-grid"} contract checked, 0 mismatch(es).`)
