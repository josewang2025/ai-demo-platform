"use client";

import { useState, useCallback, useEffect, useRef } from "react";
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

const ROTATE_MS = 4000;

/** Parse report text into sections by common headings (case-insensitive). */
function parseReportSections(report: string): Record<string, string> {
  const sections: Record<string, string> = {};
  const keys = [
    "topic summary",
    "key findings",
    "comparison view",
    "comparison",
    "opportunities",
    "risks",
    "final recommendations",
    "recommendations",
    "final report",
  ];
  const text = report.trim();
  const lower = text.toLowerCase();

  function findSection(key: string): { start: number; end: number } | null {
    const patterns = [
      new RegExp(`\\n##\\s*${key}[^\\n]*\\n`, "gi"),
      new RegExp(`\\n###?\\s*${key}[^\\n]*\\n`, "gi"),
      new RegExp(`\\n\\*\\*${key}[^\\n]*\\*\\*\\n`, "gi"),
      new RegExp(`\\n${key}\\s*:?\\s*\\n`, "gi"),
    ];
    let start = -1;
    for (const re of patterns) {
      const m = lower.match(re);
      if (m && m.index !== undefined) {
        const pos = m.index;
        if (start === -1 || pos < start) start = pos;
      }
    }
    if (start === -1) return null;
    const end = text.indexOf("\n\n", start + 1);
    return { start, end: end === -1 ? text.length : end };
  }

  let summaryEnd = text.length;
  for (const key of keys) {
    const found = findSection(key);
    if (found) {
      const normalizedKey = key.replace(/\s+/g, "");
      const raw = text.slice(found.start, found.end).replace(/^[#*\s]+/gm, "").trim();
      if (raw && !sections[normalizedKey]) sections[normalizedKey] = raw;
      if (key === "topic summary" || key === "key findings") summaryEnd = Math.min(summaryEnd, found.start);
    }
  }

  if (!sections.topicsummary && text) {
    sections.topicsummary = text.slice(0, 600).trim() + (text.length > 600 ? "…" : "");
  }
  if (!sections.finalreport && text) {
    sections.finalreport = text;
  }
  return sections;
}

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
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const suggestionRef = useRef(t(EXAMPLE_TOPIC_KEYS[0]));

  const suggestions = EXAMPLE_TOPIC_KEYS.map((k) => t(k));
  const currentSuggestion = suggestions[placeholderIndex];
  suggestionRef.current = currentSuggestion;

  useEffect(() => {
    const id = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % suggestions.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [suggestions.length]);

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
          : data.error === "analysis_service_unavailable"
            ? t("errors.analysisServiceUnavailable")
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

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== "Tab") return;
      const suggestion = suggestionRef.current;
      if (!suggestion) return;
      const trimmed = topic.trim();
      if (trimmed.length === 0 || suggestion.toLowerCase().startsWith(trimmed.toLowerCase())) {
        e.preventDefault();
        setTopic(suggestion);
      }
    },
    [topic]
  );

  const sections = report ? parseReportSections(report) : null;
  const isError = report && (
    report === t("errors.rateLimit") ||
    report === t("errors.analysisServiceUnavailable") ||
    report === t("errors.generic") ||
    report === t("research.couldNotGenerate")
  );

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
          onKeyDown={handleKeyDown}
          placeholder={currentSuggestion}
          className="mt-4 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
          aria-label={t("research.topicLabel")}
        />
        <p className="mt-1.5 text-xs text-gray-400">{t("research.tabHint")}</p>

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
      {report && !isError && sections && (
        <div className="space-y-6">
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-medium text-gray-900">{t("research.topicSummary")}</h2>
            <div className="mt-3 rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {sections.topicsummary ?? report.slice(0, 500).trim() + (report.length > 500 ? "…" : "")}
              </p>
            </div>
          </section>

          {sections.keyfindings && (
            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-medium text-gray-900">{t("research.keyFindings")}</h2>
              <div className="mt-3 rounded-lg border border-amber-100 bg-amber-50/50 p-4">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{sections.keyfindings}</p>
              </div>
            </section>
          )}

          {(sections.comparisonview || sections.comparison) && (
            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-medium text-gray-900">{t("research.comparisonView")}</h2>
              <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50/50 p-4">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {sections.comparisonview || sections.comparison}
                </p>
              </div>
            </section>
          )}

          {sections.opportunities && (
            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-medium text-gray-900">{t("research.opportunities")}</h2>
              <div className="mt-3 rounded-lg border border-green-100 bg-green-50/50 p-4">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{sections.opportunities}</p>
              </div>
            </section>
          )}

          {sections.risks && (
            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-medium text-gray-900">{t("research.risks")}</h2>
              <div className="mt-3 rounded-lg border border-red-100 bg-red-50/50 p-4">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{sections.risks}</p>
              </div>
            </section>
          )}

          {(sections.finalrecommendations || sections.recommendations) && (
            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-medium text-gray-900">{t("research.finalRecommendations")}</h2>
              <div className="mt-3 rounded-lg border border-indigo-100 bg-indigo-50/50 p-4">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {sections.finalrecommendations || sections.recommendations}
                </p>
              </div>
            </section>
          )}

          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-medium text-gray-900">{t("research.finalReport")}</h2>
            <div className="report-content mt-4 space-y-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {sections.finalreport ?? report}
            </div>
          </section>
        </div>
      )}

      {report && isError && (
        <section className="rounded-xl border border-red-200 bg-red-50/50 p-6">
          <p className="text-sm text-red-800">{report}</p>
        </section>
      )}

      {!report && !loading && (
        <section className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-8 text-center">
          <p className="text-sm text-gray-500">{t("research.emptyState")}</p>
        </section>
      )}
    </>
  );
}
