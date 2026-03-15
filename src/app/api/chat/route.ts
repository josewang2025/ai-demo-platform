/**
 * Legacy chat endpoint. Prefer /api/ai/analyze for new usage.
 * Kept for backward compatibility; all provider calls are server-side via lib/ai.
 */

import { NextResponse } from "next/server";
import { routeAndCall, type TaskHint } from "@/lib/ai/router";

export type ChatRequestBody = {
  message: string;
  provider?: "openai" | "anthropic" | "gemini";
  datasetSummary?: string;
  language?: string;
  systemPromptOverride?: string;
};

const PROVIDER_LABEL: Record<string, string> = {
  openai: "GPT",
  anthropic: "Claude",
  gemini: "Gemini",
};

function buildSystemContent(datasetSummary?: string): string {
  if (datasetSummary) {
    return `You are an ecommerce analyst. Answer using ONLY the following dataset summary. Be concise and business-focused.\n\nDataset summary:\n${datasetSummary}`;
  }
  return "You are a helpful business assistant. Answer concisely and professionally.";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatRequestBody;
    const { message, provider = "openai", datasetSummary, language, systemPromptOverride } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid message", reply: null, provider: null },
        { status: 400 }
      );
    }

    const systemContent = systemPromptOverride ?? buildSystemContent(datasetSummary);
    const maxTokens = systemPromptOverride ? 1024 : 500;
    const providerParam =
      provider === "anthropic" ? "claude" : (provider as "auto" | "openai" | "gemini");

    const { reply, provider: chosenProvider } = await routeAndCall({
      systemContent,
      userMessage: message,
      provider: providerParam,
      taskHint: "default",
      outputLanguage: language,
      maxTokens,
    });

    return NextResponse.json({
      reply,
      provider: PROVIDER_LABEL[chosenProvider] ?? chosenProvider,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Chat API error:", message);

    if (message.includes("is not set")) {
      return NextResponse.json(
        {
          reply: message,
          provider: "GPT",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        reply: `Something went wrong: ${message}. Check the server logs or .env.local.`,
        provider: "GPT",
      },
      { status: 500 }
    );
  }
}
