"use client";

import { useState, useCallback } from "react";
import type { ChatMessage } from "@/components/ui";

const EXAMPLE_PROMPTS = [
  "What’s your return and refund policy?",
  "How do I track my order?",
  "I have a billing question.",
];

const INITIAL_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "I’m your AI support assistant. Ask about returns, order tracking, billing, or other common questions. Try a prompt below or type your own. In production, I connect to your systems for accurate, up-to-date answers.",
};

export type ChatLanguage = "en" | "zh";
export type ChatProvider = "openai" | "anthropic" | "gemini";

const PROVIDER_LABELS: Record<ChatProvider, string> = {
  openai: "GPT",
  anthropic: "Claude",
  gemini: "Gemini",
};

export function AgentChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<ChatLanguage>("en");
  const [provider, setProvider] = useState<ChatProvider>("openai");

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

      const data = (await res.json()) as { success?: boolean; reply?: string; error?: string };
      const reply = data.success && data.reply
        ? data.reply
        : data.error === "rate_limit_exceeded"
          ? "Too many requests. Please try again in a minute."
          : data.error === "provider_unavailable"
            ? "AI provider unavailable. Add API keys in Environment Variables."
            : data.reply ?? "I'm not sure how to answer that. Try rephrasing or ask something else.";
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
          content:
            "In production, I’d answer from your knowledge base. Connect your API for live support.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [language, provider]);

  return (
    <AgentChatUI
      messages={messages}
      onSend={handleSend}
      suggestedPrompts={EXAMPLE_PROMPTS}
      isLoading={isLoading}
      language={language}
      onLanguageChange={setLanguage}
      provider={provider}
      onProviderChange={setProvider}
    />
  );
}

const CHAT_LANGUAGE_OPTIONS: { value: ChatLanguage; label: string }[] = [
  { value: "en", label: "English" },
  { value: "zh", label: "简体中文" },
];

const CHAT_PROVIDER_OPTIONS: { value: ChatProvider; label: string }[] = [
  { value: "openai", label: "GPT" },
  { value: "anthropic", label: "Claude" },
  { value: "gemini", label: "Gemini" },
];

type AgentChatUIProps = {
  messages: ChatMessage[];
  onSend: (message: string) => void;
  suggestedPrompts: string[];
  isLoading: boolean;
  language: ChatLanguage;
  onLanguageChange: (lang: ChatLanguage) => void;
  provider: ChatProvider;
  onProviderChange: (p: ChatProvider) => void;
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
}: AgentChatUIProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setInput("");
  };

  return (
    <div className="card">
      <h2 className="text-lg font-medium text-gray-900">Chat with the agent</h2>
      <p className="mt-2 text-sm text-gray-600 leading-relaxed">
        Ask in plain language. Try a prompt below or type your own. In production, responses come from your systems.
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
              {m.content}
            </div>
          ))}
          {isLoading && (
            <div className="max-w-[90%] self-start rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-500 shadow-sm">
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-gray-400" aria-hidden />
                Responding with {PROVIDER_LABELS[provider]}…
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-500">Model</span>
          <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-0.5" role="group" aria-label="Model">
            {CHAT_PROVIDER_OPTIONS.map((opt) => (
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
          <span className="text-sm font-medium text-gray-500">Language</span>
          <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-0.5" role="group" aria-label="Response language">
            {CHAT_LANGUAGE_OPTIONS.map((opt) => (
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
          placeholder="e.g. What’s your return policy? How do I track my order?"
          disabled={isLoading}
          className="min-h-[44px] flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="btn-primary min-h-[44px] px-5 disabled:opacity-60"
        >
          Send
        </button>
      </form>
    </div>
  );
}
