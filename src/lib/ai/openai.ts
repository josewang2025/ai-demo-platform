/**
 * OpenAI client and completion logic.
 * Server-side only — never import in client components.
 */

import OpenAI from "openai";
import { getOptionalEnv } from "@/lib/env";

const DEFAULT_MAX_TOKENS = 500;

export function getOpenAIClient(): OpenAI | null {
  const apiKey = getOptionalEnv("OPENAI_API_KEY");
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

export type OpenAIOptions = {
  systemContent: string;
  message: string;
  maxTokens?: number;
};

/**
 * Call OpenAI chat completion. Returns null if OPENAI_API_KEY is not set.
 */
export async function callOpenAI(options: OpenAIOptions): Promise<string | null> {
  const client = getOpenAIClient();
  if (!client) return null;

  const { systemContent, message, maxTokens = DEFAULT_MAX_TOKENS } = options;
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemContent },
      { role: "user", content: message },
    ],
    max_tokens: maxTokens,
  });
  return (
    completion.choices[0]?.message?.content?.trim() ||
    "I couldn't generate a response. Please try again."
  );
}
