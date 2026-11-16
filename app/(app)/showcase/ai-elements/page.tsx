import type { Metadata } from "next"

import {
  AgentDemo,
  ChainOfThoughtDemo,
  CheckpointDemo,
  ConfirmationDemo,
  ContextDemo,
  ConversationDemo,
  FileTreeDemo,
  InlineCitationDemo,
  MessageDemo,
  ModelSelectorDemo,
  PlanDemo,
  PromptInputDemo,
  QueueDemo,
  ReasoningDemo,
  SourcesDemo,
  StackTraceDemo,
  SuggestionDemo,
  TaskDemo,
  TerminalDemo,
  TestResultsDemo,
  ToolDemo,
} from "./_components/demos"
import { ShowcaseDemo, ShowcaseSection } from "../_components/showcase-section"

export const metadata: Metadata = {
  title: "AI Elements",
  description: "The AI Elements patterns shipped by the registry.",
}

export default function AiElementsShowcasePage() {
  return (
    <div className="flex flex-col">
      <ShowcaseSection
        id="chain-of-thought"
        title="Chain of thought"
        description="A summary line that expands into the steps an agent took."
      >
        <ShowcaseDemo label="chain-of-thought">
          <ChainOfThoughtDemo />
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="checkpoint"
        title="Checkpoint"
        description="A point in the conversation you can return to."
      >
        <ShowcaseDemo label="checkpoint">
          <CheckpointDemo />
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="confirmation"
        title="Confirmation"
        description="An approval request for a tool call the agent wants to run."
      >
        <ShowcaseDemo label="confirmation">
          <ConfirmationDemo />
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="context"
        title="Context"
        description="How much of the context window the conversation uses."
      >
        <ShowcaseDemo label="context">
          <ContextDemo />
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="file-tree"
        title="File tree"
        description="A browsable tree of the files an agent is working on."
      >
        <ShowcaseDemo label="file-tree" className="block w-full p-6">
          <FileTreeDemo />
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="inline-citation"
        title="Inline citation"
        description="A citation that opens the sources it points at."
      >
        <ShowcaseDemo label="inline-citation" className="block w-full p-6">
          <InlineCitationDemo />
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="message"
        title="Message"
        description="A turn in a thread, with the person on one side and the agent on the other."
      >
        <ShowcaseDemo label="message" className="block w-full p-6">
          <MessageDemo />
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="model-selector"
        title="Model selector"
        description="A menu to pick the model the agent runs on."
      >
        <ShowcaseDemo label="model-selector">
          <ModelSelectorDemo />
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="plan"
        title="Plan"
        description="The steps the agent plans to take, and how far it got."
      >
        <ShowcaseDemo label="plan">
          <PlanDemo />
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="prompt-input"
        title="Prompt input"
        description="The composer where a message and its attachments are put together."
      >
        <ShowcaseDemo label="prompt-input" className="block w-full p-6">
          <PromptInputDemo />
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="queue"
        title="Queue"
        description="The agent's todo list, split into what is left and what is done."
      >
        <ShowcaseDemo label="queue">
          <QueueDemo />
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="reasoning"
        title="Reasoning"
        description="What the agent thought while it was working."
      >
        <ShowcaseDemo label="reasoning" className="block w-full p-6">
          <ReasoningDemo />
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="sources"
        title="Sources"
        description="The links the agent used for a reply."
      >
        <ShowcaseDemo label="sources">
          <SourcesDemo />
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="suggestion"
        title="Suggestion"
        description="Prompts the user can pick instead of typing."
      >
        <ShowcaseDemo label="suggestion" className="block w-full p-6">
          <SuggestionDemo />
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="task"
        title="Task"
        description="A piece of work the agent is doing, with the steps it takes."
      >
        <ShowcaseDemo label="task">
          <TaskDemo />
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="terminal"
        title="Terminal"
        description="The output of a command the agent ran in a shell."
      >
        <ShowcaseDemo label="terminal" className="block w-full p-6">
          <TerminalDemo />
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="tool"
        title="Tool"
        description="A tool call, with its input and its output."
      >
        <ShowcaseDemo label="tool" className="block w-full p-6">
          <ToolDemo />
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="stack-trace"
        title="Stack trace"
        description="A parsed error with the frames that led to it."
      >
        <ShowcaseDemo label="stack-trace" className="block w-full p-6">
          <StackTraceDemo />
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="subagent"
        title="Subagent"
        description="A subagent, its instructions, the tools it used and its report."
      >
        <ShowcaseDemo label="subagent" className="block w-full p-6">
          <AgentDemo />
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="test-results"
        title="Test results"
        description="The suites and tests a run covered, and what failed."
      >
        <ShowcaseDemo label="test-results" className="block w-full p-6">
          <TestResultsDemo />
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="chat"
        title="Chat"
        description="The conversation thread, with a scroll-to-latest control."
      >
        <ShowcaseDemo label="chat" className="block w-full p-6">
          <ConversationDemo />
        </ShowcaseDemo>
      </ShowcaseSection>
    </div>
  )
}
