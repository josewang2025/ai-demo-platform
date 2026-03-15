/**
 * Server-side environment variable helpers.
 * Never use these in client components or expose values to the browser.
 */

export type EnvErrorCode =
  | "MISSING_OPENAI_API_KEY"
  | "MISSING_ANTHROPIC_API_KEY"
  | "MISSING_GOOGLE_API_KEY";

export class EnvError extends Error {
  constructor(
    message: string,
    public readonly code: EnvErrorCode,
    public readonly envVar: string
  ) {
    super(message);
    this.name = "EnvError";
  }
}

/**
 * Get a required env var; throws a readable EnvError if missing.
 * Use only on the server (e.g. in API routes or server components).
 */
export function getRequiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    const code =
      name === "OPENAI_API_KEY"
        ? "MISSING_OPENAI_API_KEY"
        : name === "ANTHROPIC_API_KEY"
          ? "MISSING_ANTHROPIC_API_KEY"
          : name === "GOOGLE_API_KEY"
            ? "MISSING_GOOGLE_API_KEY"
            : "MISSING_OPENAI_API_KEY";
    throw new EnvError(
      `Missing required environment variable: ${name}. Add it to .env.local for local development or to your deployment environment (e.g. Vercel Project Settings → Environment Variables).`,
      code,
      name
    );
  }
  return value;
}

/**
 * Get an optional env var; returns undefined if missing.
 */
export function getOptionalEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value || undefined;
}

/**
 * Default model provider when client does not specify one.
 * Allowed: "auto" | "openai" | "claude" | "gemini"
 */
export function getDefaultModelProvider(): "auto" | "openai" | "anthropic" | "gemini" {
  const v = getOptionalEnv("DEFAULT_MODEL_PROVIDER")?.toLowerCase();
  if (v === "openai" || v === "anthropic" || v === "claude" || v === "gemini") {
    return v === "claude" ? "anthropic" : v;
  }
  if (v === "auto") return "auto";
  return "auto";
}

/**
 * Validate environment and log clear warnings if keys are missing.
 * Call on server start; does not throw so the app can still run (e.g. with fallback provider).
 */
export function validateEnv(): void {
  const missing: string[] = [];
  if (!getOptionalEnv("OPENAI_API_KEY")) missing.push("OPENAI_API_KEY");
  if (!getOptionalEnv("ANTHROPIC_API_KEY")) missing.push("ANTHROPIC_API_KEY");
  if (!getOptionalEnv("GOOGLE_API_KEY") && !getOptionalEnv("GEMINI_API_KEY")) {
    missing.push("GOOGLE_API_KEY or GEMINI_API_KEY");
  }
  if (!getOptionalEnv("DASHSCOPE_API_KEY")) missing.push("DASHSCOPE_API_KEY (Qwen)");
  if (!getOptionalEnv("DEEPSEEK_API_KEY")) missing.push("DEEPSEEK_API_KEY");
  if (missing.length > 0) {
    console.warn(
      "[env] Missing optional API keys. Add them to .env.local or Vercel Environment Variables for full provider support:",
      missing.join(", ")
    );
  }
}
