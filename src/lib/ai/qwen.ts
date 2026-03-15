/**
 * Qwen (DashScope) provider via OpenAI-compatible API.
 * Server-side only — never import in client components.
 * Uses DASHSCOPE_API_KEY and DashScope compatible-mode endpoint.
 */

import OpenAI from "openai";
import { getOptionalEnv } from "@/lib/env";

const DEFAULT_MODEL = "qwen-plus";
const DASHSCOPE_BASE_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1";

export type QwenOptions = {
  systemContent: string;
  message: string;
  maxTokens?: number;
  model?: string;
};

function getQwenClient(): OpenAI | null {
  console.log("[QWEN] key exists:", !!process.env.DASHSCOPE_API_KEY);
  const apiKey = getOptionalEnv("DASHSCOPE_API_KEY");
  if (!apiKey) {
    console.warn("[QWEN] DASHSCOPE_API_KEY missing");
    return null;
  }
  return new OpenAI({
    apiKey,
    baseURL: DASHSCOPE_BASE_URL,
  });
}

/**
 * Call Qwen (DashScope) chat completion.
 * Returns null if DASHSCOPE_API_KEY is missing or on provider failure.
 */
export async function callQwen(options: QwenOptions): Promise<string | null> {
  const client = getQwenClient();
  if (!client) return null;

  const {
    systemContent,
    message,
    maxTokens = 500,
    model = DEFAULT_MODEL,
  } = options;

  console.log("[QWEN] model:", model);
  console.log("[QWEN] request start");

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
  } catch (error) {
    const safeMessage = error instanceof Error ? error.message : String(error);
    const status = error && typeof (error as { status?: number }).status === "number" ? (error as { status: number }).status : undefined;
    console.error("[QWEN] provider error:", safeMessage, status !== undefined ? `status=${status}` : "");
    return null;
  }
}
