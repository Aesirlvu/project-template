"use client"

import * as React from "react"

import {
  IconCheck,
  IconChevronRight,
  IconCopy,
  IconFileCode,
  IconPoint,
  IconSearch,
} from "@tabler/icons-react"

import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtHeader,
  ChainOfThoughtStep,
} from "@/components/ai-elements/chain-of-thought"
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/chat"
import {
  Checkpoint,
  CheckpointIcon,
  CheckpointTrigger,
} from "@/components/ai-elements/checkpoint"
import {
  Confirmation,
  ConfirmationAction,
  ConfirmationActions,
  ConfirmationTitle,
} from "@/components/ai-elements/confirmation"
import {
  Context,
  ContextContent,
  ContextContentBody,
  ContextContentFooter,
  ContextContentHeader,
  ContextTrigger,
} from "@/components/ai-elements/context"
import {
  FileTree,
  FileTreeFile,
  FileTreeFolder,
} from "@/components/ai-elements/file-tree"
import {
  InlineCitationCard,
  InlineCitationCardBody,
  InlineCitationCardTrigger,
  InlineCitationSource,
} from "@/components/ai-elements/inline-citation"
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message"
import {
  ModelSelector,
  ModelSelectorContent,
  ModelSelectorGroup,
  ModelSelectorItem,
  ModelSelectorList,
  ModelSelectorSeparator,
  ModelSelectorTrigger,
} from "@/components/ai-elements/model-selector"
import {
  Plan,
  PlanContent,
  PlanHeader,
  PlanTitle,
  PlanTrigger,
} from "@/components/ai-elements/plan"
import {
  PromptInput,
  PromptInputHeader,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input"
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning"
import {
  Queue,
  QueueItem,
  QueueList,
  QueueSectionLabel,
} from "@/components/ai-elements/queue"
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@/components/ai-elements/sources"
import {
  StackTrace,
  StackTraceContent,
  StackTraceError,
  StackTraceFrames,
  StackTraceHeader,
} from "@/components/ai-elements/stack-trace"
import {
  Agent,
  AgentContent,
  AgentHeader,
  AgentInstructions,
  AgentOutput,
  AgentTool,
  AgentTools,
} from "@/components/ai-elements/subagent"
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion"
import {
  Task,
  TaskContent,
  TaskItem,
  TaskTrigger,
} from "@/components/ai-elements/task"
import {
  Terminal,
  TerminalContent,
  TerminalHeader,
  TerminalTitle,
} from "@/components/ai-elements/terminal"
import {
  Test,
  TestError,
  TestResults,
  TestResultsContent,
  TestResultsHeader,
  TestSuite,
  TestSuiteContent,
  TestSuiteName,
} from "@/components/ai-elements/test-results"
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trace, TraceLine } from "@/components/ui/trace"

export function ChainOfThoughtDemo() {
  return (
    <ChainOfThought defaultOpen>
      <ChainOfThoughtHeader>
        Searched the repository for the auth flow
      </ChainOfThoughtHeader>
      <ChainOfThoughtContent>
        <ChainOfThoughtStep
          icon={IconSearch}
          label="Search the codebase"
          description="Matched 12 files mentioning session tokens"
          status="complete"
        />
        <ChainOfThoughtStep
          icon={IconFileCode}
          label="Read the middleware"
          description="app/(app)/layout.tsx"
          status="complete"
        />
        <ChainOfThoughtStep
          icon={IconPoint}
          label="Compare with the registry item"
          description="Checking the target paths"
          status="active"
        />
        <ChainOfThoughtStep label="Write the summary" status="pending" />
      </ChainOfThoughtContent>
    </ChainOfThought>
  )
}

export function CheckpointDemo() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        A checkpoint marks a point you can come back to.
      </p>
      <Checkpoint>
        <CheckpointIcon />
        <CheckpointTrigger tooltip="Restore the conversation to this point">
          Restore
        </CheckpointTrigger>
      </Checkpoint>
    </div>
  )
}

export function ConfirmationDemo() {
  const [state, setState] = React.useState<
    "input-available" | "output-available"
  >("output-available")

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="w-fit">
          state: {state}
        </Badge>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setState((current) =>
              current === "output-available"
                ? "input-available"
                : "output-available"
            )
          }
        >
          Toggle state
        </Button>
      </div>
      <Confirmation
        approval={{ id: "call-1" }}
        state={state}
        variant="outline"
        size="sm"
      >
        <ConfirmationTitle
          title="Run pnpm test?"
          description="The command runs in this project."
        />
        <ConfirmationActions>
          <ConfirmationAction
            variant="outline"
            onClick={() => setState("output-available")}
          >
            Approve
          </ConfirmationAction>
        </ConfirmationActions>
      </Confirmation>
    </div>
  )
}

export function ContextDemo() {
  return (
    <Context
      usedTokens={10660}
      maxTokens={128000}
      modelId="gpt-5-mini"
      cost={{ total: 0.042, input: 0.031, output: 0.011 }}
    >
      <ContextTrigger />
      <ContextContent>
        <ContextContentHeader />
        <ContextContentBody>
          <p className="text-sm text-muted-foreground">
            The context window holds the conversation, the tool results and the
            system prompt.
          </p>
        </ContextContentBody>
        <ContextContentFooter />
      </ContextContent>
    </Context>
  )
}

export function FileTreeDemo() {
  const [selected, setSelected] = React.useState("components/ui/button.tsx")

  return (
    <FileTree
      className="w-full max-w-sm"
      defaultExpanded={new Set(["components", "components/ui"])}
      selectedPath={selected}
      onSelect={setSelected}
    >
      <FileTreeFolder path="components" name="components">
        <FileTreeFolder path="components/ui" name="ui">
          <FileTreeFile
            path="components/ui/button.tsx"
            name="button.tsx"
            icon={<IconFileCode className="size-4" />}
          />
          <FileTreeFile
            path="components/ui/badge.tsx"
            name="badge.tsx"
            icon={<IconFileCode className="size-4" />}
          />
          <FileTreeFile
            path="components/ui/input-group.tsx"
            name="input-group.tsx"
            icon={<IconFileCode className="size-4" />}
          />
        </FileTreeFolder>
      </FileTreeFolder>
      <FileTreeFile
        path="registry.json"
        name="registry.json"
        icon={<IconPoint className="size-4" />}
      />
      <FileTreeFile
        path="package.json"
        name="package.json"
        icon={<IconPoint className="size-4" />}
      />
    </FileTree>
  )
}

export function InlineCitationDemo() {
  return (
    <p className="max-w-md text-sm leading-relaxed">
      Next.js streams a route in chunks, so the page shows up before every
      request finishes.{" "}
      <InlineCitationCard>
        <InlineCitationCardTrigger sources={["Next.js docs", "React docs"]} />
        <InlineCitationCardBody>
          <InlineCitationSource
            title="Streaming UI"
            url="https://nextjs.org/docs"
            description="How the App Router streams a route."
          />
          <InlineCitationSource
            title="React Suspense"
            url="https://react.dev/reference/react/Suspense"
            description="Sending the fallback first."
          />
        </InlineCitationCardBody>
      </InlineCitationCard>
    </p>
  )
}

const MODELS = [
  { id: "gpt-5-mini", name: "GPT-5 mini" },
  { id: "gpt-5", name: "GPT-5" },
  { id: "claude-sonnet-5", name: "Claude Sonnet 5" },
]

export function ModelSelectorDemo() {
  const [model, setModel] = React.useState(MODELS[0].id)
  const current = MODELS.find((item) => item.id === model) ?? MODELS[0]

  return (
    <ModelSelector>
      <ModelSelectorTrigger render={<Button variant="outline" size="sm" />}>
        {current.name}
        <IconChevronRight className="rotate-90" />
      </ModelSelectorTrigger>
      <ModelSelectorContent align="start" title="Model" className="w-56">
        <ModelSelectorList value={model} onValueChange={setModel}>
          <ModelSelectorGroup heading="OpenAI">
            {MODELS.slice(0, 2).map((item) => (
              <ModelSelectorItem key={item.id} value={item.id}>
                {item.name}
              </ModelSelectorItem>
            ))}
          </ModelSelectorGroup>
        </ModelSelectorList>
        <ModelSelectorSeparator />
        <ModelSelectorList value={model} onValueChange={setModel}>
          <ModelSelectorGroup heading="Anthropic">
            {MODELS.slice(2).map((item) => (
              <ModelSelectorItem key={item.id} value={item.id}>
                {item.name}
              </ModelSelectorItem>
            ))}
          </ModelSelectorGroup>
        </ModelSelectorList>
      </ModelSelectorContent>
    </ModelSelector>
  )
}

export function PlanDemo() {
  return (
    <Plan defaultOpen isStreaming>
      <PlanHeader>
        <PlanTitle>Ship the registry item</PlanTitle>
        <PlanTrigger />
      </PlanHeader>
      <PlanContent>
        <Trace>
          <TraceLine>Write the pattern file</TraceLine>
          <TraceLine>Add the showcase route</TraceLine>
          <TraceLine>Validate the registry</TraceLine>
        </Trace>
      </PlanContent>
    </Plan>
  )
}

export function QueueDemo() {
  return (
    <Queue>
      <QueueSectionLabel label="2 to do" icon={<IconPoint />} />
      <QueueList>
        <QueueItem>
          <span className="text-sm">Download the upstream originals</span>
        </QueueItem>
        <QueueItem>
          <span className="text-sm">Compare the class output</span>
        </QueueItem>
      </QueueList>
      <QueueSectionLabel label="1 done" icon={<IconCheck />} />
      <QueueList>
        <QueueItem>
          <span className="text-sm text-muted-foreground line-through">
            Install the registry dependencies
          </span>
        </QueueItem>
      </QueueList>
    </Queue>
  )
}

export function SourcesDemo() {
  return (
    <Sources defaultOpen>
      <SourcesTrigger count={3} />
      <SourcesContent>
        <Source
          href="https://ui.shadcn.com/docs/ai-elements"
          title="AI Elements"
        />
        <Source href="https://ai-sdk.dev/docs" title="AI SDK documentation" />
        <Source href="https://nextjs.org/docs" title="Next.js documentation" />
      </SourcesContent>
    </Sources>
  )
}

const SUGGESTIONS = [
  "Add a dark mode toggle",
  "Split the showcase by category",
  "Publish the registry item",
  "Add keyboard shortcuts",
]

const RESPONSE_MARKDOWN = `The item is ready to install:

\`\`\`bash
npx shadcn@latest add Aesirlvu/project-template/ai-elements
\`\`\`

It pulls **ui-kit** first, so the consumer keeps a single source of truth for
the primitives.`

const CONVERSATION_MARKDOWN = `I added the patterns as **21 files** under
\`components/ai-elements/\`, each one with the API from the migration guide.`

export function SuggestionDemo() {
  const [picked, setPicked] = React.useState<string | null>(null)

  return (
    <div className="flex flex-col gap-3">
      <Suggestions>
        {SUGGESTIONS.map((suggestion) => (
          <Suggestion
            key={suggestion}
            suggestion={suggestion}
            onClick={setPicked}
          />
        ))}
      </Suggestions>
      {picked ? (
        <p className="text-sm text-muted-foreground">Picked: {picked}</p>
      ) : null}
    </div>
  )
}

export function TaskDemo() {
  return (
    <Task defaultOpen>
      <TaskTrigger title="Publish the registry" />
      <TaskContent>
        <TaskItem>Validate the registry</TaskItem>
        <TaskItem>Push the item files</TaskItem>
        <TaskItem>Align the local branch</TaskItem>
      </TaskContent>
    </Task>
  )
}

export function MessageDemo() {
  const [copied, setCopied] = React.useState(false)

  return (
    <div className="flex flex-col gap-6">
      <Message from="user">
        <MessageContent>
          <p>Ship the registry item for the AI Elements patterns.</p>
        </MessageContent>
        <MessageActions>
          <MessageAction tooltip="Copy the message" label="Copy the message">
            <IconCopy aria-hidden="true" />
          </MessageAction>
        </MessageActions>
      </Message>

      <Message from="assistant">
        <MessageContent>
          <MessageResponse>{RESPONSE_MARKDOWN}</MessageResponse>
        </MessageContent>
        <MessageActions>
          <MessageAction
            tooltip={copied ? "Copied" : "Copy the response"}
            label={copied ? "Copied" : "Copy the response"}
            onClick={() => setCopied(true)}
          >
            <IconCopy aria-hidden="true" />
          </MessageAction>
        </MessageActions>
      </Message>
    </div>
  )
}

export function PromptInputDemo() {
  const [sent, setSent] = React.useState<string | null>(null)

  return (
    <div className="flex flex-col gap-4">
      <PromptInput onSubmit={(message) => setSent(message.text)}>
        <PromptInputHeader />
        <PromptInputTextarea />
        <PromptInputSubmit status="ready" />
      </PromptInput>
      {sent ? (
        <p className="text-sm text-muted-foreground">Sent: {sent}</p>
      ) : null}
    </div>
  )
}

export function ReasoningDemo() {
  const [streaming, setStreaming] = React.useState(false)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="w-fit">
          {streaming ? "streaming" : "done"}
        </Badge>
        <Button variant="outline" size="sm" onClick={() => setStreaming(true)}>
          Start thinking
        </Button>
        <Button variant="outline" size="sm" onClick={() => setStreaming(false)}>
          Finish
        </Button>
      </div>
      <Reasoning isStreaming={streaming} duration={4}>
        <ReasoningTrigger>Reasoning</ReasoningTrigger>
        <ReasoningContent>
          The registry item depends on ui-kit, so it has to resolve the consumer
          aliases before it copies the files.
        </ReasoningContent>
      </Reasoning>
    </div>
  )
}

const TERMINAL_OUTPUT = `$ npm run build
▲ Next.js 16.4.4 (Turbopack)
✓ Compiled successfully in 5.2s
✓ Generating static pages using 11 workers (17/17)`

export function TerminalDemo() {
  const [output, setOutput] = React.useState(TERMINAL_OUTPUT)
  const [running, setRunning] = React.useState(false)

  React.useEffect(() => {
    if (!running) {
      return
    }
    const timer = setTimeout(() => {
      setOutput((current) => `${current}\n✓ Build completed`)
      setRunning(false)
    }, 1200)
    return () => clearTimeout(timer)
  }, [running])

  return (
    <div className="flex flex-col gap-4">
      <Button variant="outline" size="sm" onClick={() => setRunning(true)}>
        Run the build
      </Button>
      <Terminal
        defaultOpen
        isStreaming={running}
        onClear={() => setOutput("")}
        output={output}
      >
        <TerminalHeader>
          <TerminalTitle>npm run build</TerminalTitle>
        </TerminalHeader>
        <TerminalContent />
      </Terminal>
    </div>
  )
}

export function ToolDemo() {
  return (
    <Tool defaultOpen>
      <ToolHeader
        title="readFile"
        type="tool-readFile"
        state="input-available"
      />
      <ToolContent>
        <ToolInput input={{ path: "registry.json" }} />
        <ToolOutput output="9 items" />
      </ToolContent>
    </Tool>
  )
}

const STACK_TRACE = `TypeError: Cannot read properties of undefined (reading 'variants')
    at Button (components/ui/button.tsx:42:18)
    at ShowcaseActionsPage (app/(app)/showcase/actions/page.tsx:118:5)
    at Object.render (node_modules/react-dom/cjs/react-dom-client.development.js:16286:19)
    at renderWithHooks (node_modules/react-dom/cjs/react-dom-client.development.js:15486:18)`

export function StackTraceDemo() {
  const [file, setFile] = React.useState<string | null>(null)

  return (
    <div className="flex flex-col gap-4">
      <StackTrace defaultOpen trace={STACK_TRACE} onFilePathClick={setFile}>
        <StackTraceHeader>
          <StackTraceError />
        </StackTraceHeader>
        <StackTraceContent>
          <StackTraceFrames />
        </StackTraceContent>
      </StackTrace>
      {file ? (
        <p className="text-sm text-muted-foreground">Opened: {file}</p>
      ) : null}
    </div>
  )
}

export function AgentDemo() {
  return (
    <Agent>
      <AgentHeader name="Ran the research agent" model="gpt-5-mini" />
      <AgentContent>
        <AgentInstructions>
          Find every consumer of the registry item and report the alias they
          resolve.
        </AgentInstructions>
        <AgentTools>
          <AgentTool
            tool={{
              type: "dynamic-tool",
              toolName: "search",
              title: "Search files",
              toolCallId: "call-search",
              state: "input-available",
              input: undefined,
            }}
          />
          <AgentTool
            tool={{
              type: "dynamic-tool",
              toolName: "read",
              title: "Read a file",
              toolCallId: "call-read",
              state: "input-available",
              input: undefined,
            }}
          />
        </AgentTools>
        <AgentOutput schema="{ aliases: string[] }" />
      </AgentContent>
    </Agent>
  )
}

export function TestResultsDemo() {
  return (
    <TestResults summary={{ passed: 12, failed: 1, skipped: 2, total: 15 }}>
      <TestResultsHeader />
      <TestResultsContent>
        <TestSuite name="registry" status="failed">
          <TestSuiteName />
          <TestSuiteContent>
            <Test name="validates the item" status="passed" />
            <Test name="resolves the aliases" status="passed" />
            <Test name="installs the files" status="failed">
              <TestError>
                <p>Expected 24 files, got 23.</p>
              </TestError>
            </Test>
          </TestSuiteContent>
        </TestSuite>
      </TestResultsContent>
    </TestResults>
  )
}

export function ConversationDemo() {
  return (
    <Conversation>
      <ConversationContent>
        <Message from="user">
          <MessageContent>
            <p>Which patterns did you add?</p>
          </MessageContent>
        </Message>
        <Message from="assistant">
          <MessageContent>
            <MessageResponse>{CONVERSATION_MARKDOWN}</MessageResponse>
          </MessageContent>
        </Message>
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  )
}
