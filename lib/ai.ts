import type { UIMessage } from "ai"

export * from "@shadcn/helpers/ai-sdk"

/**
 * Concatenates the text parts of a UI message.
 *
 * `UIMessage.parts` is the canonical AI SDK 7 shape: a message is a list of
 * typed parts, and only the `text` ones carry renderable prose.
 */
export function getMessageText(message: Pick<UIMessage, "parts">): string {
  return message.parts.reduce(
    (text, part) => (part.type === "text" ? text + part.text : text),
    ""
  )
}
