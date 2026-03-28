/**
 * Provider-specific error message keys for the UI.
 * Use with t(getProviderUnavailableErrorKey(provider)) when API returns provider_unavailable.
 */

const PROVIDER_ERROR_KEYS: Record<string, string> = {
  qwen: "errors.providerUnavailableQwen",
  deepseek: "errors.providerUnavailableDeepSeek",
  openai: "errors.providerUnavailableOpenAI",
  claude: "errors.providerUnavailableClaude",
  gemini: "errors.providerUnavailableGemini",
};

export function getProviderUnavailableErrorKey(provider?: string): string {
  return (provider && PROVIDER_ERROR_KEYS[provider]) || "errors.providerUnavailable";
}
