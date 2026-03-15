/**
 * Provider routing: select provider based on mode and optional task type.
 * Server-side only. Never log API keys.
 */

import { getOptionalEnv } from "@/lib/env";
import { callOpenAI } from "./openai";
import { callAnthropic } from "./anthropic";
import { callGemini } from "./gemini";
import { callQwen } from "./qwen";
import { callDeepSeek } from "./deepseek";

export type ProviderId = "openai" | "anthropic" | "gemini" | "qwen" | "deepseek";
export type TaskHint = "ecommerce" | "research" | "reasoning" | "default";

export type AvailableProviders = Record<
  "openai" | "claude" | "gemini" | "qwen" | "deepseek",
  boolean
>;

/** Which providers have keys configured. Never log these values. */
export function getAvailableProviders(): AvailableProviders {
  return {
    openai: !!getOptionalEnv("OPENAI_API_KEY"),
    claude: !!getOptionalEnv("ANTHROPIC_API_KEY"),
    gemini: !!(getOptionalEnv("GOOGLE_API_KEY") || getOptionalEnv("GEMINI_API_KEY")),
    qwen: !!getOptionalEnv("DASHSCOPE_API_KEY"),
    deepseek: !!getOptionalEnv("DEEPSEEK_API_KEY"),
  };
}

const LANGUAGE_INSTRUCTION: Record<string, string> = {
  en: "Respond in English.",
  zh: "Respond in 简体中文 (Simplified Chinese).",
};

export type RouteOptions = {
  systemContent: string;
  userMessage: string;
  provider: "auto" | "openai" | "claude" | "gemini" | "qwen" | "deepseek";
  taskHint?: TaskHint | string;
  outputLanguage?: string;
  maxTokens?: number;
};

/**
 * Resolve provider when mode is "auto":
 * - For zh ecommerce/data/general tasks, prefer qwen or deepseek when available.
 * - Otherwise: ecommerce → openai, research → gemini, reasoning → claude, default → openai.
 */
function resolveAutoProvider(
  taskHint: TaskHint | string = "default",
  outputLanguage?: string
): ProviderId {
  const isZh = outputLanguage === "zh";
  const preferZhProvider =
    isZh &&
    (taskHint === "ecommerce" || taskHint === "research" || taskHint === "default" || taskHint === "data");

  if (preferZhProvider) {
    return "qwen";
  }

  switch (taskHint) {
    case "ecommerce":
      return "openai";
    case "research":
      return "gemini";
    case "reasoning":
      return "anthropic";
    default:
      return "openai";
  }
}

function resolveProvider(
  provider: "auto" | "openai" | "claude" | "gemini" | "qwen" | "deepseek",
  taskHint: TaskHint | string = "default",
  outputLanguage?: string
): ProviderId {
  if (provider === "auto") return resolveAutoProvider(taskHint, outputLanguage);
  if (provider === "claude") return "anthropic";
  if (
    provider === "openai" ||
    provider === "gemini" ||
    provider === "qwen" ||
    provider === "deepseek"
  ) {
    return provider;
  }
  return "openai";
}

/** Fallback order when preferred provider is unavailable. Qwen and deepseek participate. */
const FALLBACK_ORDER: Array<keyof AvailableProviders> = [
  "openai",
  "qwen",
  "deepseek",
  "claude",
  "gemini",
];

/** Pick first available provider: preferred first, then fallback order. */
function fallbackProvider(
  preferred: ProviderId,
  available: AvailableProviders
): ProviderId | null {
  const map: Record<ProviderId, keyof AvailableProviders> = {
    openai: "openai",
    anthropic: "claude",
    gemini: "gemini",
    qwen: "qwen",
    deepseek: "deepseek",
  };
  const key = map[preferred];
  if (key && available[key]) return preferred;

  for (const k of FALLBACK_ORDER) {
    if (!available[k]) continue;
    if (k === "openai") return "openai";
    if (k === "claude") return "anthropic";
    if (k === "gemini") return "gemini";
    if (k === "qwen") return "qwen";
    if (k === "deepseek") return "deepseek";
  }
  return null;
}

function appendLanguageInstruction(content: string, lang?: string): string {
  if (!lang || !LANGUAGE_INSTRUCTION[lang]) return content;
  return content + " " + LANGUAGE_INSTRUCTION[lang];
}

/**
 * Route the request to the correct provider and return the reply text.
 * If the selected provider is unavailable, falls back to another available provider.
 * Never returns or logs API keys.
 */
export async function routeAndCall(
  options: RouteOptions
): Promise<{ reply: string; provider: ProviderId }> {
  const {
    systemContent,
    userMessage,
    provider,
    taskHint = "default",
    outputLanguage,
    maxTokens = 500,
  } = options;

  const available = getAvailableProviders();
  const preferred = resolveProvider(provider, taskHint, outputLanguage);
  const chosen = fallbackProvider(preferred, available);

  console.info("AI provider selected:", chosen ?? "none");
  console.info("Task hint:", taskHint);

  if (!chosen) {
    throw new Error(
      "No AI provider available. Add at least one of OPENAI_API_KEY, ANTHROPIC_API_KEY, GOOGLE_API_KEY, DASHSCOPE_API_KEY, or DEEPSEEK_API_KEY to .env.local or Vercel Environment Variables."
    );
  }

  const system = appendLanguageInstruction(systemContent, outputLanguage);
  const payload = { systemContent: system, message: userMessage, maxTokens };

  if (chosen === "openai") {
    const reply = await callOpenAI(payload);
    if (reply !== null) return { reply, provider: "openai" };
  }

  if (chosen === "anthropic") {
    const reply = await callAnthropic(payload);
    if (reply !== null) return { reply, provider: "anthropic" };
  }

  if (chosen === "gemini") {
    const reply = await callGemini(payload);
    if (reply !== null) return { reply, provider: "gemini" };
  }

  if (chosen === "qwen") {
    const reply = await callQwen(payload);
    if (reply !== null) return { reply, provider: "qwen" };
  }

  if (chosen === "deepseek") {
    const reply = await callDeepSeek(payload);
    if (reply !== null) return { reply, provider: "deepseek" };
  }

  throw new Error("Provider unavailable. Check your API keys and try again.");
}
