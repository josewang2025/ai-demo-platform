"use client";

import React, { useState } from "react";

export type ChatMessage = {
  id: number | string;
  role: "user" | "assistant";
  content: string;
};

type ChatPanelProps = {
  title: string;
  description?: string;
  messages: ChatMessage[];
  onSend: (message: string) => void;
  suggestedPrompts?: string[];
  placeholder?: string;
  isLoading?: boolean;
  className?: string;
};

export function ChatPanel({
  title,
  description,
  messages,
  onSend,
  suggestedPrompts = [],
  placeholder = "Type your message...",
  isLoading = false,
  className = "",
}: ChatPanelProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setInput("");
  };

  return (
    <section className={`card ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="card-title">{title}</h2>
          {description && (
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          )}
        </div>
      </div>

      {suggestedPrompts.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {suggestedPrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setInput(prompt)}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-left text-xs text-slate-600 transition hover:bg-slate-100"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      <div className="mt-6 min-h-[200px] rounded-2xl border border-slate-100 bg-slate-50/80 p-4" role="log" aria-live="polite">
        <div className="flex h-full min-h-[200px] flex-col gap-3 overflow-y-auto">
          {messages.map((m) => (
            <div
              key={m.id}
              className={
                m.role === "assistant"
                  ? "self-start max-w-[85%] rounded-2xl bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm"
                  : "self-end max-w-[85%] rounded-2xl bg-slate-900 px-4 py-2.5 text-sm text-white"
              }
            >
              {m.content}
            </div>
          ))}
          {isLoading && (
            <div className="self-start rounded-2xl bg-white px-4 py-2.5 text-sm text-slate-500 shadow-sm" aria-busy="true">
              <span className="inline-block animate-pulse">Thinking...</span>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          disabled={isLoading}
          className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60"
        >
          Send
        </button>
      </form>
    </section>
  );
}
