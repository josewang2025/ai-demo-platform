/**
 * Provider routing: select provider based on mode and optional task type.
 * Server-side only. Never log API keys.
 */

import { getOptionalEnv } from "@/lib/env";
import { callOpenAI } from "./openai";
import { callAnthropic } from "./anthropic";
import { callGemini } from "./gemini";

export type ProviderId = "openai" | "anthropic" | "gemini";
export type TaskHint = "ecommerce" | "research" | "reasoning" | "default";

/** Which providers have keys configured. Never log these values. */
export function getAvailableProviders(): Record<"openai" | "claude" | "gemini", boolean> {
  return {
    openai: !!getOptionalEnv("OPENAI_API_KEY"),
    claude: !!getOptionalEnv("ANTHROPIC_API_KEY"),
    gemini: !!(getOptionalEnv("GOOGLE_API_KEY") || getOptionalEnv("GEMINI_API_KEY")),
  };
}

const LANGUAGE_INSTRUCTION: Record<string, string> = {
  en: "Respond in English.",
  zh: "Respond in 简体中文 (Simplified Chinese).",
};

export type RouteOptions = {
  systemContent: string;
  userMessage: string;
  provider: "auto" | "openai" | "claude" | "gemini";
  taskHint?: TaskHint | string;
  outputLanguage?: string;
  maxTokens?: number;
};

/**
 * Resolve provider when mode is "auto":
 * - ecommerce → openai
 * - research → gemini
 * - reasoning → claude (anthropic)
 * - otherwise → openai
 */
function resolveAutoProvider(taskHint: TaskHint | string = "default"): ProviderId {
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
  provider: "auto" | "openai" | "claude" | "gemini",
  taskHint: TaskHint | string = "default"
): ProviderId {
  if (provider === "auto") return resolveAutoProvider(taskHint);
  if (provider === "claude") return "anthropic";
  if (provider === "openai" || provider === "gemini") return provider;
  return "openai";
}

/** Pick first available provider in order. */
function fallbackProvider(
  preferred: ProviderId,
  available: Record<"openai" | "claude" | "gemini", boolean>
): ProviderId | null {
  const map: Record<ProviderId, keyof typeof available> = {
    openai: "openai",
    anthropic: "claude",
    gemini: "gemini",
  };
  if (available[map[preferred]]) return preferred;
  if (available.openai) return "openai";
  if (available.claude) return "anthropic";
  if (available.gemini) return "gemini";
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
  const preferred = resolveProvider(provider, taskHint);
  const chosen = fallbackProvider(preferred, available);

  console.info("AI provider selected:", chosen ?? "none");
  console.info("Task hint:", taskHint);

  if (!chosen) {
    throw new Error(
      "No AI provider available. Add at least one of OPENAI_API_KEY, ANTHROPIC_API_KEY, or GOOGLE_API_KEY to .env.local or Vercel Environment Variables."
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

  throw new Error("Provider unavailable. Check your API keys and try again.");
}
