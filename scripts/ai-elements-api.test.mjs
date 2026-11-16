#!/usr/bin/env node
// Contract test for the AI Elements patterns.
//
// Every pattern must keep the exports described in the "Migrating from AI SDK
// Elements" section of its upstream page:
// https://ui.shadcn.com/docs/ai-elements/base/<name>
//
// The table below is the minimum public surface. A pattern is allowed to
// export more (extra parts, prop types, helpers), never less.

import { readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import path from "node:path"

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
)

const EXPECTED = {
  "chain-of-thought": [
    "ChainOfThought",
    "ChainOfThoughtHeader",
    "ChainOfThoughtContent",
    "ChainOfThoughtStep",
    "ChainOfThoughtSearchResults",
  ],
  chat: ["Conversation", "ConversationContent", "ConversationScrollButton"],
  checkpoint: ["Checkpoint", "CheckpointIcon", "CheckpointTrigger"],
  confirmation: [
    "Confirmation",
    "ConfirmationTitle",
    "ConfirmationActions",
    "ConfirmationAction",
  ],
  context: [
    "Context",
    "ContextTrigger",
    "ContextContent",
    "ContextContentHeader",
  ],
  "file-tree": ["FileTreeFolder", "FileTreeFile"],
  "inline-citation": [
    "InlineCitationCard",
    "InlineCitationCardTrigger",
    "InlineCitationCardBody",
    "InlineCitationSource",
  ],
  message: ["Message", "MessageContent", "MessageActions", "MessageAction"],
  "model-selector": [
    "ModelSelector",
    "ModelSelectorContent",
    "ModelSelectorGroup",
    "ModelSelectorItem",
    "ModelSelectorSeparator",
  ],
  plan: [
    "Plan",
    "PlanHeader",
    "PlanTitle",
    "PlanContent",
    "PlanTrigger",
  ],
  "prompt-input": [
    "PromptInputTextarea",
    "PromptInputActionMenuTrigger",
    "PromptInputSubmit",
    "PromptInputHeader",
  ],
  queue: ["Queue", "QueueSectionLabel", "QueueList", "QueueItem"],
  reasoning: ["Reasoning", "ReasoningTrigger", "ReasoningContent"],
  sources: ["Sources", "SourcesTrigger", "SourcesContent", "Source"],
  "stack-trace": [
    "StackTrace",
    "StackTraceHeader",
    "StackTraceError",
    "StackTraceContent",
    "StackTraceFrames",
    "StackTraceExpandButton",
  ],
  subagent: ["Agent", "AgentHeader", "AgentContent", "AgentTools"],
  suggestion: ["Suggestions", "Suggestion"],
  task: ["Task", "TaskTrigger", "TaskContent", "TaskItem"],
  terminal: [
    "Terminal",
    "TerminalHeader",
    "TerminalTitle",
    "TerminalContent",
  ],
  "test-results": [
    "TestResults",
    "TestResultsHeader",
    "TestResultsContent",
    "TestSuite",
    "Test",
    "TestError",
  ],
  tool: ["Tool", "ToolHeader", "ToolContent"],
}

function collectExports(source) {
  const names = new Set()
  const patterns = [
    /export\s+(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/g,
    /export\s+(?:const|let|var)\s+([A-Za-z_$][\w$]*)/g,
    /export\s+(?:type|interface)\s+([A-Za-z_$][\w$]*)/g,
    /export\s+(?:default\s+)?class\s+([A-Za-z_$][\w$]*)/g,
  ]
  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) {
      names.add(match[1])
    }
  }
  for (const match of source.matchAll(/export\s*\{([^}]*)\}/g)) {
    for (const entry of match[1].split(",")) {
      const cleaned = entry.trim().replace(/^type\s+/, "")
      if (!cleaned) continue
      const alias = cleaned.split(/\s+as\s+/).pop().trim()
      if (alias) names.add(alias)
    }
  }
  return names
}

const failures = []
let checked = 0

for (const [pattern, expected] of Object.entries(EXPECTED)) {
  const file = path.join(ROOT, "components", "ai-elements", `${pattern}.tsx`)
  let source
  try {
    source = await readFile(file, "utf8")
  } catch {
    failures.push(`${pattern}: missing ${path.relative(ROOT, file)}`)
    continue
  }

  if (/from\s+["']lucide-react["']/.test(source)) {
    failures.push(`${pattern}: imports lucide-react, this project uses Tabler`)
  }

  const exports = collectExports(source)
  for (const name of expected) {
    checked += 1
    if (!exports.has(name)) {
      failures.push(`${pattern}: missing export "${name}"`)
    }
  }
  console.log(
    `PASS  ${pattern} (${expected.length} required exports, ${exports.size} found)`
  )
}

if (failures.length > 0) {
  console.error("\nFAILURES:")
  for (const failure of failures) console.error(`  - ${failure}`)
  console.error(
    `\n${failures.length} failure(s), ${checked} required exports checked.`
  )
  process.exit(1)
}

console.log(
  `\n${Object.keys(EXPECTED).length} patterns checked, ${checked} required exports, 0 mismatch(es).`
)
