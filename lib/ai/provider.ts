/**
 * Shared AI provider for the template.
 *
 * Uses the Vercel AI Gateway, so projects start without wiring a provider SDK.
 * Set AI_GATEWAY_API_KEY in .env.local to enable hosted models.
 *
 * For a custom instance (custom base URL, headers, or a per-team key):
 *
 *   import { createGateway } from "ai"
 *   const gateway = createGateway({ apiKey: process.env.AI_GATEWAY_API_KEY })
 *
 * To use a provider directly, replace the gateway with it, for example
 * `createOpenAI({ apiKey: process.env.OPENAI_API_KEY })`.
 */

import { createGateway } from "ai"

export const aiProvider = createGateway({
  apiKey: process.env.AI_GATEWAY_API_KEY ?? "",
})

/**
 * Default model used by the template examples.
 * Override it per project with the AI_DEFAULT_MODEL environment variable.
 * Model IDs follow the `provider/model` format listed by the AI Gateway.
 */
export const defaultModel = process.env.AI_DEFAULT_MODEL ?? "openai/gpt-5-mini"
