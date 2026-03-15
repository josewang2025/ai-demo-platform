import { NextResponse } from "next/server";
import { routeAndCall, type TaskHint } from "@/lib/ai/router";
import { getDefaultModelProvider } from "@/lib/env";
import { checkRateLimit } from "@/lib/rate-limit";

export type AnalyzeRequestBody = {
  input: string;
  provider?: "auto" | "openai" | "claude" | "gemini" | "qwen" | "deepseek" | "anthropic";
  responseMode?: "fast" | "deep" | "research";
  outputLanguage?: "en" | "zh";
  reportStyle?: "concise" | "executive" | "detailed";
  systemPromptOverride?: string;
  datasetSummary?: string;
  taskHint?: string;
};

const PROVIDER_LABEL: Record<string, string> = {
  openai: "openai",
  anthropic: "claude",
  gemini: "gemini",
  qwen: "qwen",
  deepseek: "deepseek",
};

function buildDefaultSystemContent(datasetSummary?: string): string {
  if (datasetSummary) {
    return `You are an analyst. Answer using ONLY the following dataset summary. Be concise and business-focused.\n\nDataset summary:\n${datasetSummary}`;
  }
  return "You are a helpful business assistant. Answer concisely and professionally.";
}

export async function POST(request: Request) {
  const rate = checkRateLimit(request);
  if (!rate.allowed) {
    return NextResponse.json(
      { success: false, error: "rate_limit_exceeded" },
      { status: 429 }
    );
  }

  try {
    const body = (await request.json()) as AnalyzeRequestBody;
    const {
      input,
      provider: requestedProvider,
      responseMode = "fast",
      outputLanguage = "en",
      systemPromptOverride,
      datasetSummary,
      taskHint = "default",
    } = body;

    if (!input || typeof input !== "string") {
      return NextResponse.json(
        { success: false, error: "invalid_request" },
        { status: 400 }
      );
    }

    const provider =
      requestedProvider ?? getDefaultModelProvider();
    const systemContent =
      systemPromptOverride ?? buildDefaultSystemContent(datasetSummary);
    const maxTokens = responseMode === "research" || systemPromptOverride ? 1024 : 500;

    const routeProvider =
      provider === "anthropic" ? "claude" : provider;

    const { reply, provider: chosenProvider } = await routeAndCall({
      systemContent,
      userMessage: input,
      provider: routeProvider as "auto" | "openai" | "claude" | "gemini" | "qwen" | "deepseek",
      taskHint: (taskHint as TaskHint) ?? "default",
      outputLanguage,
      maxTokens,
    });

    const providerLabel = PROVIDER_LABEL[chosenProvider] ?? chosenProvider;
    return NextResponse.json({
      success: true,
      provider: providerLabel,
      reply,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("AI analyze error:", message);

    const providerMatch = message.match(/Provider unavailable \((\w+)\)/);
    if (providerMatch) {
      console.error("[ANALYZE] provider_failed code=provider_unavailable provider=" + providerMatch[1]);
    }

    if (message.includes("No AI provider available") || message.includes("is not set")) {
      return NextResponse.json(
        { success: false, error: "provider_unavailable" },
        { status: 503 }
      );
    }

    if (message.includes("Provider unavailable")) {
      return NextResponse.json(
        { success: false, error: "provider_unavailable" },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { success: false, error: "internal_error" },
      { status: 500 }
    );
  }
}
