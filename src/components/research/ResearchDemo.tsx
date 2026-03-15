"use client";

import { useState, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getResolvedProviderForApi, type ModelProvider } from "@/components/demo";
import { getProviderUnavailableErrorKey } from "@/lib/providerError";

const EXAMPLE_TOPIC_KEYS = [
  "research.exampleTopic1",
  "research.exampleTopic2",
  "research.exampleTopic3",
  "research.exampleTopic4",
  "research.exampleTopic5",
] as const;

export function ResearchDemo({
  modelProvider = "auto",
  outputLanguage = "en",
  responseMode = "fast",
  reportStyle = "concise",
}: {
  modelProvider?: ModelProvider;
  outputLanguage?: "en" | "zh";
  responseMode?: "fast" | "deep" | "research";
  reportStyle?: "concise" | "executive" | "detailed";
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
      const providerForApi = getResolvedProviderForApi(modelProvider ?? "auto");
      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: `Research this topic in ${depth} depth and provide a structured report: ${topic}`,
          provider: providerForApi,
          outputLanguage,
          responseMode,
          reportStyle,
          taskHint: "research",
        }),
      });
      const data = (await res.json()) as { success?: boolean; reply?: string; error?: string; provider?: string };
      const message = data.success && data.reply
        ? data.reply
        : data.error === "rate_limit_exceeded"
          ? t("errors.rateLimit")
          : data.error === "provider_unavailable"
            ? t(getProviderUnavailableErrorKey(data.provider))
            : data.reply ?? t("research.couldNotGenerate");
      setReport(message);
    } catch {
      setReport(t("errors.generic"));
    } finally {
      setLoading(false);
    }
  }, [topic, depth, modelProvider, outputLanguage, responseMode, reportStyle, loading, t]);

  return (
    <>
      {/* What you'll get */}
      <section className="rounded-xl border border-gray-200 bg-sky-50/50 p-5">
        <h2 className="text-base font-semibold text-gray-900">{t("research.whatYouGet")}</h2>
        <p className="mt-2 text-sm text-gray-600">{t("research.whatYouGetDesc")}</p>
      </section>

      {/* Input */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-medium text-gray-900">{t("research.topicLabel")}</h2>

        <p className="mt-2 text-sm text-gray-500">{t("research.exampleTopics")}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {EXAMPLE_TOPIC_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTopic(t(key))}
              className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50"
            >
              {t(key)}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder={t("research.topicPlaceholder")}
          className="mt-4 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
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
          className="mt-6 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-60"
        >
          {loading ? t("research.generating") : t("research.generateReport")}
        </button>
      </section>

      {/* Output */}
      {report && (
        <>
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-medium text-gray-900">{t("research.topicSummary")}</h2>
            <div className="mt-3 rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {report.length > 500 ? report.slice(0, 500).trim() + "…" : report}
              </p>
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-medium text-gray-900">{t("research.finalReport")}</h2>
            <div className="report-content mt-4 space-y-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {report}
            </div>
          </section>
        </>
      )}

      {!report && !loading && (
        <section className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-8 text-center">
          <p className="text-sm text-gray-500">{t("research.emptyState")}</p>
        </section>
      )}
    </>
  );
}
