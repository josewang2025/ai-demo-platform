import { getProviderUnavailableErrorKey } from "@/lib/providerError";

export type AnalyzeApiResponse = {
  success?: boolean;
  reply?: string;
  error?: string;
  provider?: string;
};

/**
 * Extract the display message from an /api/ai/analyze response,
 * mapping known error codes to translated strings.
 */
export function resolveApiReply(
  data: AnalyzeApiResponse,
  t: (key: string) => string,
  fallbackKey = "errors.generic"
): string {
  if (data.success && data.reply) return data.reply;

  if (data.error === "rate_limit_exceeded") return t("errors.rateLimit");
  if (data.error === "analysis_service_unavailable") return t("errors.analysisServiceUnavailable");
  if (data.error === "provider_unavailable") return t(getProviderUnavailableErrorKey(data.provider));

  return data.reply ?? t(fallbackKey);
}
