/**
 * Anthropic (Claude) API calls.
 * Server-side only — never import in client components.
 */

import { getOptionalEnv } from "@/lib/env";

const DEFAULT_MAX_TOKENS = 500;

export function getAnthropicApiKey(): string | null {
  return getOptionalEnv("ANTHROPIC_API_KEY") ?? null;
}

export type AnthropicOptions = {
  systemContent: string;
  message: string;
  maxTokens?: number;
};

export async function callAnthropic(options: AnthropicOptions): Promise<string | null> {
  const apiKey = getAnthropicApiKey();
  if (!apiKey) return null;

  const { systemContent, message, maxTokens = DEFAULT_MAX_TOKENS } = options;
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-5-haiku-20241022",
      max_tokens: maxTokens,
      system: systemContent,
      messages: [{ role: "user", content: message }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic API error: ${res.status} ${err}`);
  }

  const data = (await res.json()) as {
    content?: Array<{ type: string; text?: string }>;
  };
  const text = data.content?.[0]?.text?.trim();
  return text || "I couldn't generate a response. Please try again.";
}
