"use client";

import { useState, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

type Provider = "auto" | "openai" | "anthropic" | "gemini";

export function ResearchDemo({
  modelProvider = "auto",
  outputLanguage = "en",
}: {
  modelProvider?: Provider;
  outputLanguage?: "en" | "zh";
}) {
  const { t } = useLanguage();
  const [topic, setTopic] = useState("");
  const [depth, setDepth] = useState<"quick" | "standard" | "deep">("standard");
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRun = useCallback(async () => {
    if (!topic.trim() || loading) return;
    setLoading(true);
    setReport(null);
    try {
      const provider = modelProvider === "auto" ? "openai" : modelProvider;
      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: `Research this topic in ${depth} depth and provide a structured report: ${topic}`,
          provider,
          outputLanguage,
          taskHint: "research",
        }),
      });
      const data = (await res.json()) as { success?: boolean; reply?: string; error?: string };
      const message = data.success && data.reply
        ? data.reply
        : data.error === "rate_limit_exceeded"
          ? "Too many requests. Please try again in a minute."
          : data.error === "provider_unavailable"
            ? "AI provider unavailable. Add API keys in Environment Variables."
            : data.reply ?? "Could not generate report.";
      setReport(message);
    } catch {
      setReport("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }, [topic, depth, modelProvider, outputLanguage, loading]);

  return (
    <>
      {/* Input */}
      <section className="card">
        <h2 className="text-lg font-medium text-gray-900">{t("research.topicLabel")}</h2>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder={t("research.topicPlaceholder")}
          className="mt-3 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
        />
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">{t("research.depthLabel")}</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {(["quick", "standard", "deep"] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDepth(d)}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  depth === d
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {d === "quick" && t("research.depthQuick")}
                {d === "standard" && t("research.depthStandard")}
                {d === "deep" && t("research.depthDeep")}
              </button>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={handleRun}
          disabled={!topic.trim() || loading}
          className="mt-6 btn-primary disabled:opacity-60"
        >
          {loading ? "Researching…" : "Generate report"}
        </button>
      </section>

      {/* Output placeholders */}
      {report && (
        <>
          <section className="card">
            <h2 className="text-lg font-medium text-gray-900">{t("research.topicSummary")}</h2>
            <p className="mt-3 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{report.slice(0, 400)}…</p>
          </section>
          <section className="card">
            <h2 className="text-lg font-medium text-gray-900">{t("research.keyFindings")}</h2>
            <p className="mt-3 text-sm text-gray-500">Key findings will appear here when the research pipeline is connected.</p>
          </section>
          <section className="card">
            <h2 className="text-lg font-medium text-gray-900">{t("research.comparisonView")}</h2>
            <p className="mt-3 text-sm text-gray-500">Comparison view will appear here when the research pipeline is connected.</p>
          </section>
          <section className="card">
            <h2 className="text-lg font-medium text-gray-900">{t("research.finalReport")}</h2>
            <p className="mt-3 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{report}</p>
          </section>
        </>
      )}

      {!report && !loading && (
        <section className="card">
          <p className="text-sm text-gray-500">Enter a topic above and click Generate report to see Topic Summary, Key Findings, Comparison View, and Final Report.</p>
        </section>
      )}
    </>
  );
}
