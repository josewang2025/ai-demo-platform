/**
 * Reusable provider options config.
 * Server-side only — do not expose secrets or import in client components.
 * Use for routing, availability, and server-side label lookup.
 */

export type ProviderOptionId =
  | "auto"
  | "openai"
  | "claude"
  | "gemini"
  | "qwen"
  | "deepseek";

export type ProviderOption = {
  id: ProviderOptionId;
  labelEn: string;
  labelZh: string;
};

export const PROVIDER_OPTIONS: ProviderOption[] = [
  { id: "auto", labelEn: "Auto Router", labelZh: "自动路由" },
  { id: "openai", labelEn: "OpenAI", labelZh: "OpenAI" },
  { id: "claude", labelEn: "Claude", labelZh: "Claude" },
  { id: "gemini", labelEn: "Gemini", labelZh: "Gemini" },
  { id: "qwen", labelEn: "Qwen", labelZh: "千问" },
  { id: "deepseek", labelEn: "DeepSeek", labelZh: "DeepSeek" },
];

export function getProviderLabel(id: ProviderOptionId, locale: "en" | "zh"): string {
  const opt = PROVIDER_OPTIONS.find((o) => o.id === id);
  if (!opt) return id;
  return locale === "zh" ? opt.labelZh : opt.labelEn;
}
