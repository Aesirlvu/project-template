// Verifies that every migrated component declares the SAME class strings as the
// official shadcn implementation it replaces.
//
// Method: fetch the official registry item, extract every class string literal
// from the original cva definition and from the migrated compose definition,
// then check that the original's strings all appear in the migrated definition.
//
// Usage: node scripts/class-parity.mjs
//        node scripts/class-parity.mjs --update   (refresh the cached originals)

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const REGISTRY_URL = "https://ui.shadcn.com/r/styles/base-sera"
const CACHE = join(import.meta.dirname, "..", ".registry-cache", "originals")
const REPO = join(import.meta.dirname, "..")

const cases = [
  { name: "alert", pairs: [["alertVariants", "AlertBase ="]] },
  {
    name: "attachment",
    pairs: [
      ["attachmentVariants", "AttachmentBase ="],
      ["attachmentMediaVariants", "AttachmentMediaBase ="],
    ],
  },
  {
    name: "bubble",
    pairs: [
      ["bubbleVariants", "BubbleBase ="],
      ["bubbleReactionsVariants", "BubbleReactionsBase ="],
    ],
  },
  {
    name: "code-block",
    pairs: [
      ["codeBlockVariants", "CodeBlockBase ="],
      ["codeBlockLineVariants", "CodeBlockLineBase ="],
    ],
  },
  { name: "empty", pairs: [["emptyMediaVariants", "EmptyMediaBase ="]] },
  { name: "field", pairs: [["fieldVariants", "FieldBase ="]] },
  {
    name: "input-group",
    pairs: [
      ["inputGroupAddonVariants", "InputGroupAddonBase ="],
      ["inputGroupButtonVariants", "InputGroupButtonBase ="],
    ],
  },
  {
    name: "item",
    pairs: [
      ["itemVariants", "ItemBase ="],
      ["itemMediaVariants", "ItemMediaBase ="],
    ],
  },
  {
    name: "navigation-menu",
    pairs: [["navigationMenuTriggerStyle", "navigationMenuTriggerClasses ="]],
  },
  {
    name: "sidebar",
    pairs: [["sidebarMenuButtonVariants", "SidebarMenuButtonBase ="]],
  },
]

/**
 * Pull the quoted class strings out of a source snippet.
 *
 * Variant KEYS (e.g. "icon", "default") are not class lists. They are
 * detected by their position: a quoted value that is followed by a colon is
 * a variant key, and a quoted value inside a `defaultVariants` block is a
 * variant key too. Only real class lists are kept.
 */
function classStrings(source) {
  // The defaultVariants block holds variant NAMES, never class lists.
  const withoutDefaults = source.replace(
    /defaultVariants\s*:\s*\{[^}]*\}/g,
    ""
  )
  const out = []
  const re = /"([^"]*)"(\s*:)?/g
  let match
  while ((match = re.exec(withoutDefaults)) !== null) {
    const value = match[1]
    // "icon": -> variant key, not a class list.
    if (match[2] === ":") continue
    if (!value.trim()) continue
    out.push(value.trim())
  }
  return out
}

/** Extract a block starting at a declaration, ending at the next declaration. */
function block(source, header) {
  const start = source.indexOf(header)
  if (start === -1) return null
  const rest = source.slice(start)
  const nextDecl = rest.slice(header.length).search(/\n(?:const|function|export)\s/)
  return nextDecl === -1 ? rest : rest.slice(0, header.length + nextDecl)
}

async function originalSource(name, { update }) {
  const cached = join(CACHE, `${name}.tsx`)
  if (!update && existsSync(cached)) {
    return readFileSync(cached, "utf8")
  }

  const response = await fetch(`${REGISTRY_URL}/${name}.json`)
  if (!response.ok) {
    throw new Error(`Failed to fetch ${name}: ${response.status}`)
  }
  const payload = await response.json()
  const content = payload?.files?.[0]?.content
  if (!content) {
    throw new Error(`No file content in registry payload for ${name}`)
  }

  mkdirSync(CACHE, { recursive: true })
  writeFileSync(cached, content)
  return content
}

const update = process.argv.includes("--update")
let failures = 0
let checked = 0

for (const testCase of cases) {
  let original
  try {
    original = await originalSource(testCase.name, { update })
  } catch (error) {
    console.log(`FAIL  ${testCase.name}: ${error.message}`)
    failures++
    continue
  }

  const migrated = readFileSync(
    join(REPO, "components/ui", `${testCase.name}.tsx`),
    "utf8"
  )

  for (const [variant, migratedHeader] of testCase.pairs) {
    const originalBlock = block(original, `const ${variant} = cva(`)
    const migratedBlock = block(migrated, `const ${migratedHeader}`)

    if (!originalBlock) {
      console.log(`SKIP  ${testCase.name}/${variant}: cva not found in original`)
      continue
    }
    if (!migratedBlock) {
      console.log(`FAIL  ${testCase.name}/${variant}: "${migratedHeader}" not found`)
      failures++
      continue
    }

    const originalStrings = classStrings(originalBlock)
    const migratedStrings = classStrings(migratedBlock)
    const migratedSet = new Set(migratedStrings)
    const missing = originalStrings.filter((value) => !migratedSet.has(value))

    checked++
    if (missing.length > 0) {
      failures++
      console.log(
        `FAIL  ${testCase.name}/${variant}: ${missing.length} class string(s) missing`
      )
      for (const value of missing) console.log(`        "${value}"`)
    } else {
      console.log(
        `PASS  ${testCase.name}/${variant} (${originalStrings.length} class strings)`
      )
    }
  }
}

console.log(
  `\n${checked} variant definitions checked, ${failures} mismatch(es).`
)
process.exit(failures === 0 ? 0 : 1)
