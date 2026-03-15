/**
 * Google Gemini API calls.
 * Server-side only — never import in client components.
 * Supports GOOGLE_API_KEY (Vercel) and GEMINI_API_KEY (alternative).
 */

import { getOptionalEnv } from "@/lib/env";

const DEFAULT_MAX_TOKENS = 500;

export function getGeminiApiKey(): string | null {
  return getOptionalEnv("GOOGLE_API_KEY") ?? getOptionalEnv("GEMINI_API_KEY") ?? null;
}

export type GeminiOptions = {
  systemContent: string;
  message: string;
  maxTokens?: number;
};

export async function callGemini(options: GeminiOptions): Promise<string | null> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) return null;

  const { systemContent, message, maxTokens = DEFAULT_MAX_TOKENS } = options;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemContent }] },
      contents: [{ parts: [{ text: message }] }],
      generationConfig: { maxOutputTokens: maxTokens },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error: ${res.status} ${err}`);
  }

  const data = (await res.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  return text || "I couldn't generate a response. Please try again.";
}
