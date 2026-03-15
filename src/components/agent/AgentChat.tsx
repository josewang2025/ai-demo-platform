"use client";

import { useState, useCallback, useMemo } from "react";
import type { ChatMessage } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { getProviderUnavailableErrorKey } from "@/lib/providerError";

export type ChatLanguage = "en" | "zh";
export type ChatProvider = "openai" | "anthropic" | "gemini";

export function AgentChat() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "welcome", role: "assistant", content: "" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<ChatLanguage>("en");
  const [provider, setProvider] = useState<ChatProvider>("openai");

  const suggestedPrompts = useMemo(
    () => [t("agent.prompt1"), t("agent.prompt2"), t("agent.prompt3")],
    [t]
  );

  const handleSend = useCallback(async (content: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: content, provider, outputLanguage: language }),
      });

        const data = (await res.json()) as { success?: boolean; reply?: string; error?: string; provider?: string };
        const reply = data.success && data.reply
          ? data.reply
          : data.error === "rate_limit_exceeded"
            ? t("errors.rateLimit")
            : data.error === "provider_unavailable"
              ? t(getProviderUnavailableErrorKey(data.provider))
              : data.reply ?? t("agent.notSure");
      setMessages((prev) => [
        ...prev,
        { id: `assistant-${Date.now()}`, role: "assistant", content: reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: t("agent.errorFallback"),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [language, provider, t]);

  return (
    <AgentChatUI
      messages={messages}
      onSend={handleSend}
      suggestedPrompts={suggestedPrompts}
      isLoading={isLoading}
      language={language}
      onLanguageChange={setLanguage}
      provider={provider}
      onProviderChange={setProvider}
      t={t}
    />
  );
}

type AgentChatUIProps = {
  messages: ChatMessage[];
  onSend: (message: string) => void;
  suggestedPrompts: string[];
  isLoading: boolean;
  language: ChatLanguage;
  onLanguageChange: (lang: ChatLanguage) => void;
  provider: ChatProvider;
  onProviderChange: (p: ChatProvider) => void;
  t: (key: string) => string;
};

function AgentChatUI({
  messages,
  onSend,
  suggestedPrompts,
  isLoading,
  language,
  onLanguageChange,
  provider,
  onProviderChange,
  t,
}: AgentChatUIProps) {
  const [input, setInput] = useState("");

  const languageOptions = [
    { value: "en" as const, label: t("advanced.outputEn") },
    { value: "zh" as const, label: t("advanced.outputZh") },
  ];
  const providerOptions = [
    { value: "openai" as ChatProvider, label: t("advanced.modelOpenAI") },
    { value: "anthropic" as ChatProvider, label: t("advanced.modelClaude") },
    { value: "gemini" as ChatProvider, label: t("advanced.modelGemini") },
  ];
  const providerLabel = providerOptions.find((o) => o.value === provider)?.label ?? provider;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setInput("");
  };

  return (
    <div className="card">
      <h2 className="text-lg font-medium text-gray-900">{t("agent.title")}</h2>
      <p className="mt-2 text-sm text-gray-600 leading-relaxed">
        {t("agent.welcomeMessage")}
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {suggestedPrompts.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setInput(prompt)}
            className="rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="mt-6 min-h-[260px] rounded-xl border border-gray-200 bg-gray-50 p-5 shadow-sm">
        <div className="flex min-h-[240px] flex-col gap-3 overflow-y-auto">
          {messages.map((m) => (
            <div
              key={m.id}
              className={
                m.role === "assistant"
                  ? "max-w-[90%] self-start rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm"
                  : "max-w-[90%] self-end rounded-xl bg-gray-900 px-4 py-3 text-sm text-white"
              }
            >
              {m.id === "welcome" ? t("agent.welcomeMessage") : m.content}
            </div>
          ))}
          {isLoading && (
            <div className="max-w-[90%] self-start rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-500 shadow-sm">
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-gray-400" aria-hidden />
                {t("common.respondingWith")} {providerLabel}…
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-500">{t("agent.providerLabel")}</span>
          <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-0.5" role="group" aria-label={t("agent.providerLabel")}>
            {providerOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onProviderChange(opt.value)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  provider === opt.value
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-500">{t("agent.languageLabel")}</span>
          <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-0.5" role="group" aria-label={t("agent.languageLabel")}>
            {languageOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onLanguageChange(opt.value)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  language === opt.value
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-3 flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("agent.placeholder")}
          disabled={isLoading}
          className="min-h-[44px] flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="btn-primary min-h-[44px] px-5 disabled:opacity-60"
        >
          {t("common.send")}
        </button>
      </form>
    </div>
  );
}
