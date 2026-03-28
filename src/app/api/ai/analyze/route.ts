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

function buildResponseModeAndReportStyleInstructions(
  responseMode: "fast" | "deep" | "research",
  reportStyle: "concise" | "executive" | "detailed"
): string {
  const modeInstructions: Record<string, string> = {
    fast: "Response mode: FAST. Give short answers with simple structure, few sections, and quick highlights only. Minimize length and token usage.",
    deep: "Response mode: DEEP. Provide structured analysis with clear reasoning, stronger insights, and include risks and recommendations.",
    research: "Response mode: RESEARCH. Be context-aware, include comparative analysis, synthesized findings, and consultant/analyst-style output.",
  };
  const styleInstructions: Record<string, string> = {
    concise: "Report style: CONCISE. Use a short summary, minimal sections, and keep everything highly skimmable.",
    executive: "Report style: EXECUTIVE. Include an executive summary, KPIs/findings/risks/recommendations, suitable for decision makers.",
    detailed: "Report style: DETAILED. Use more section depth, richer explanation, and more breakdown and interpretation.",
  };
  return [modeInstructions[responseMode], styleInstructions[reportStyle]].filter(Boolean).join(" ");
}

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

  let requestedProvider: AnalyzeRequestBody["provider"];
  try {
    const body = (await request.json()) as AnalyzeRequestBody;
    requestedProvider = body.provider;
    const {
      input,
      responseMode = "fast",
      outputLanguage = "en",
      reportStyle = "concise",
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
      body.provider ?? getDefaultModelProvider();
    const baseContent =
      systemPromptOverride ?? buildDefaultSystemContent(datasetSummary);
    const modeAndStyle = buildResponseModeAndReportStyleInstructions(responseMode, reportStyle);
    const systemContent = baseContent + "\n\n" + modeAndStyle;
    const maxTokens = responseMode === "research" || systemPromptOverride ? 1024 : responseMode === "deep" ? 800 : 500;

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

    if (requestedProvider === "auto") {
      return NextResponse.json(
        { success: false, error: "analysis_service_unavailable" },
        { status: 503 }
      );
    }

    const explicitMatch = message.match(/^PROVIDER_UNAVAILABLE:(\w+)$/);
    const afterCallMatch = message.match(/Provider unavailable \((\w+)\)/);
    const providerId = explicitMatch?.[1] ?? afterCallMatch?.[1];

    if (providerId) {
      console.error("[ANALYZE] provider_failed code=provider_unavailable provider=" + providerId);
    }

    if (message.includes("No AI provider available") || message.includes("is not set")) {
      return NextResponse.json(
        { success: false, error: "provider_unavailable" },
        { status: 503 }
      );
    }

    if (message.startsWith("PROVIDER_UNAVAILABLE:") || message.includes("Provider unavailable")) {
      const providerForClient = providerId === "anthropic" ? "claude" : providerId ?? "unknown";
      return NextResponse.json(
        { success: false, error: "provider_unavailable", provider: providerForClient },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { success: false, error: "internal_error" },
      { status: 500 }
    );
  }
}
