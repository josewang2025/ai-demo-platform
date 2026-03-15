/**
 * DeepSeek provider via OpenAI-compatible API.
 * Server-side only — never import in client components.
 * Uses DEEPSEEK_API_KEY.
 */

import OpenAI from "openai";
import { getOptionalEnv } from "@/lib/env";

const DEFAULT_MODEL = "deepseek-chat";
const DEEPSEEK_BASE_URL = "https://api.deepseek.com";

export type DeepSeekOptions = {
  systemContent: string;
  message: string;
  maxTokens?: number;
  model?: string;
};

function getDeepSeekClient(): OpenAI | null {
  const apiKey = getOptionalEnv("DEEPSEEK_API_KEY");
  if (!apiKey) return null;
  return new OpenAI({
    apiKey,
    baseURL: DEEPSEEK_BASE_URL,
  });
}

/**
 * Call DeepSeek chat completion.
 * Returns null if DEEPSEEK_API_KEY is missing or on provider failure.
 */
export async function callDeepSeek(options: DeepSeekOptions): Promise<string | null> {
  const client = getDeepSeekClient();
  if (!client) return null;

  const {
    systemContent,
    message,
    maxTokens = 500,
    model = DEFAULT_MODEL,
  } = options;

  try {
    const completion = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemContent },
        { role: "user", content: message },
      ],
      max_tokens: maxTokens,
    });

    const text = completion.choices[0]?.message?.content?.trim();
    return text || "I couldn't generate a response. Please try again.";
  } catch {
    return null;
  }
}
