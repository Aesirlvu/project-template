import { streamText } from "ai"

import { aiProvider, defaultModel } from "@/lib/ai/provider"

/**
 * Stream a text response from the configured model.
 *
 * Swap `defaultModel` for any `provider/model` ID available through the
 * AI Gateway, or set AI_DEFAULT_MODEL to change it per environment.
 */
export async function streamCompletion(prompt: string) {
  const result = streamText({
    model: aiProvider(defaultModel),
    prompt,
  })

  return result.textStream
}
