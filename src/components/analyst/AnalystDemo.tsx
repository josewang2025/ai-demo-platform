"use client";

import { useRef, useState, useMemo, useCallback } from "react";
import Papa from "papaparse";
import { SAMPLE_ANALYST_DATA, type AnalystRow } from "@/components/analyst/analystSampleData";
import {
  computeAnalystDashboard,
  buildAnalystDatasetSummary,
} from "@/components/analyst/analystDashboardUtils";
import { MetricCard, RevenueTrendChart, HorizontalBarChart } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { getResolvedProviderForApi, type ModelProvider } from "@/components/demo";
import { getProviderUnavailableErrorKey } from "@/lib/providerError";

const CARD_CLASS = "rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md";

const EXPECTED_COLUMNS = [
  "date",
  "region",
  "segment",
  "revenue",
  "orders",
  "profit",
  "customer_count",
];

function parseCsvToAnalystRows(csvText: string): AnalystRow[] {
  const result = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
  });
  if (result.errors.length > 0) throw new Error(result.errors.map((e) => e.message).join("; "));
  const rows = result.data;
  if (rows.length === 0) return [];
  const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, "_");
  const keys = Object.keys(rows[0]).map((k) => norm(k));
  const normalizedExpected = EXPECTED_COLUMNS.map((c) => norm(c));
  const missing = normalizedExpected.filter((c) => !keys.includes(c));
  if (missing.length > 0) {
    throw new Error(`Missing columns: ${missing.join(", ")}. Use template: /analyst_template.csv`);
  }
  const get = (row: Record<string, string>, col: string) => {
    const key = Object.keys(row).find((k) => norm(k) === norm(col));
    return (key ? row[key] : "") ?? "";
  };
  return rows.map((row) => ({
    date: get(row, "date").trim(),
    region: get(row, "region").trim(),
    segment: get(row, "segment").trim(),
    revenue: parseFloat(get(row, "revenue") || "0") || 0,
    orders: parseInt(get(row, "orders") || "0", 10) || 0,
    profit: parseFloat(get(row, "profit") || "0") || 0,
    customer_count: parseInt(get(row, "customer_count") || "0", 10) || 0,
  }));
}

type ChatMessage = { id: number | string; role: "user" | "assistant"; content: string };

const SUGGESTED_KEYS = [
  "analyst.suggested1",
  "analyst.suggested2",
  "analyst.suggested3",
  "analyst.suggested4",
  "analyst.suggested5",
] as const;

export function AnalystDemo({
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
  const [data, setData] = useState<AnalystRow[] | null>(() => SAMPLE_ANALYST_DATA);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "welcome", role: "assistant", content: "" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const inputSectionRef = useRef<HTMLDivElement>(null);
  const firstSuggestionRef = useRef(t(SUGGESTED_KEYS[0]));

  const suggestedPrompts = SUGGESTED_KEYS.map((k) => t(k));
  firstSuggestionRef.current = suggestedPrompts[0];

  const dashboard = useMemo(
    () => (data ? computeAnalystDashboard(data) : null),
    [data]
  );
  const datasetSummary = useMemo(
    () => (data ? buildAnalystDatasetSummary(data) : ""),
    [data]
  );
  const hasData = data !== null && data.length > 0;
  const isSample = hasData && !uploadedFileName;

  const handleUseSample = useCallback(() => {
    setData(SAMPLE_ANALYST_DATA);
    setUploadedFileName(null);
    setParseError(null);
  }, []);

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setParseError(null);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = parseCsvToAnalystRows(String(reader.result));
        setData(parsed);
        setUploadedFileName(file.name);
      } catch (err) {
        setParseError(err instanceof Error ? err.message : "Failed to parse CSV");
      }
    };
    reader.readAsText(file, "UTF-8");
    e.target.value = "";
  }, []);

  const handleDrop: React.DragEventHandler<HTMLDivElement> = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    setParseError(null);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = parseCsvToAnalystRows(String(reader.result));
        setData(parsed);
        setUploadedFileName(file.name);
      } catch (err) {
        setParseError(err instanceof Error ? err.message : "Failed to parse");
      }
    };
    reader.readAsText(file, "UTF-8");
  }, []);

  const triggerUpload = useCallback(() => {
    inputSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => fileInputRef.current?.click(), 400);
  }, []);

  const handleSubmitChat = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const trimmed = chatInput.trim();
      if (!trimmed || chatLoading) return;
      setMessages((prev) => [...prev, { id: `user-${Date.now()}`, role: "user", content: trimmed }]);
      setChatInput("");
      setChatLoading(true);
      const providerForApi = getResolvedProviderForApi(modelProvider ?? "auto");
      try {
        const res = await fetch("/api/ai/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            input: trimmed,
            provider: providerForApi,
            outputLanguage,
            responseMode,
            reportStyle,
            ...(datasetSummary ? { datasetSummary } : {}),
          }),
        });
        const dataRes = (await res.json()) as {
          success?: boolean;
          reply?: string;
          error?: string;
          provider?: string;
        };
        const message = dataRes.success && dataRes.reply
          ? dataRes.reply
          : dataRes.error === "rate_limit_exceeded"
            ? t("errors.rateLimit")
            : dataRes.error === "analysis_service_unavailable"
              ? t("errors.analysisServiceUnavailable")
              : dataRes.error === "provider_unavailable"
                ? t(getProviderUnavailableErrorKey(dataRes.provider))
                : dataRes.reply ?? t("analyst.couldNotGenerate");
        setMessages((prev) => [
          ...prev,
          { id: `a-${Date.now()}`, role: "assistant", content: message },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          { id: `a-${Date.now()}`, role: "assistant", content: t("errors.generic") },
        ]);
      } finally {
        setChatLoading(false);
      }
    },
    [chatInput, chatLoading, datasetSummary, modelProvider, outputLanguage, responseMode, reportStyle, t]
  );

  const handleChatKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== "Tab") return;
      const suggestion = firstSuggestionRef.current;
      if (!suggestion) return;
      const trimmed = chatInput.trim();
      if (trimmed.length === 0 || suggestion.toLowerCase().startsWith(trimmed.toLowerCase())) {
        e.preventDefault();
        setChatInput(suggestion);
      }
    },
    [chatInput]
  );

  return (
    <div className="mt-10 space-y-14">
      {/* Hero */}
      <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm md:p-10">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          {t("analyst.heroTitle")}
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-gray-600">
          {t("analyst.heroSubtitle")}
        </p>
        <p className="mt-2 text-sm text-gray-500">
          {t("analyst.heroSupport")}
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <button type="button" onClick={handleUseSample} className="btn-primary">
            {t("analyst.trySampleData")}
          </button>
          <button type="button" onClick={triggerUpload} className="btn-secondary">
            {t("analyst.uploadCsv")}
          </button>
        </div>
      </section>

      {/* Data input */}
      <section ref={inputSectionRef} className={CARD_CLASS}>
        <h2 className="text-lg font-medium text-gray-900">{t("common.yourData")}</h2>
        {hasData && (
          <p className="mt-2 text-sm text-gray-600">
            {isSample
              ? `${t("common.usingSampleData")} (${data!.length} ${t("common.rows")})`
              : `${t("common.loaded")}: ${uploadedFileName} (${data!.length} ${t("common.rows")})`}
          </p>
        )}
        <div
          className="mt-6 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/80 px-6 py-10 text-center"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <p className="text-sm font-medium text-gray-900">{t("common.dragDropCsv")}</p>
          <p className="mt-1.5 text-sm text-gray-500">{t("analyst.uploadHint")}</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn-secondary py-2.5 px-4"
            >
              {t("common.chooseFile")}
            </button>
            <a
              href="/analyst_template.csv"
              download="analyst_template.csv"
              className="btn-secondary inline-block py-2.5 px-4"
            >
              {t("common.downloadSample")}
            </a>
            <button type="button" onClick={handleUseSample} className="btn-secondary py-2.5 px-4">
              {t("common.useSampleData")}
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileChange}
          />
          {parseError && <p className="mt-4 text-sm text-red-600">{parseError}</p>}
        </div>

        <div className="mt-6">
          <p className="text-sm font-medium text-gray-700">{t("common.exampleQuestions")}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {suggestedPrompts.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setChatInput(p)}
                className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-left text-sm text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* KPI Overview */}
      {dashboard && (
        <>
          <section className={CARD_CLASS} aria-label={t("analyst.kpiSnapshot")}>
            <h2 className="text-lg font-medium text-gray-900">{t("analyst.kpiSnapshot")}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                label="Revenue"
                value={`$${dashboard.totalRevenue.toLocaleString("en-US", { maximumFractionDigits: 0 })}`}
              />
              <MetricCard label="Orders" value={dashboard.totalOrders.toLocaleString()} />
              <MetricCard
                label="Profit"
                value={`$${dashboard.totalProfit.toLocaleString("en-US", { maximumFractionDigits: 0 })}`}
              />
              <MetricCard label="Customers" value={dashboard.totalCustomers.toLocaleString()} />
            </div>
          </section>

          <section className={CARD_CLASS} aria-label={t("analyst.visualDashboard")}>
            <h2 className="text-lg font-medium text-gray-900">{t("analyst.visualDashboard")}</h2>
            <div className="mt-6 grid gap-8 lg:grid-cols-2">
              <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-5">
                <h3 className="text-sm font-semibold text-gray-900">{t("analyst.revenueTrend")}</h3>
                <RevenueTrendChart
                  data={dashboard.revenueByMonth.map((m) => ({ label: m.month, value: m.value }))}
                  valueLabel={t("analyst.revenueTrend")}
                />
              </div>
              <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-5">
                <h3 className="text-sm font-semibold text-gray-900">{t("analyst.segmentBreakdown")}</h3>
                <HorizontalBarChart
                  data={dashboard.topSegments.map((s) => ({ label: s.name, value: s.value }))}
                  maxItems={8}
                />
              </div>
            </div>
            {dashboard.regionBreakdown.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-900">{t("analyst.regionBreakdown")}</h3>
                <HorizontalBarChart
                  data={dashboard.regionBreakdown.map((r) => ({ label: r.name, value: r.value }))}
                  maxItems={6}
                />
              </div>
            )}
          </section>

          <section className={CARD_CLASS}>
            <h2 className="text-lg font-medium text-gray-900">{t("analyst.suggestedActions")}</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-gray-700">
              {dashboard.topSegments.length > 0 && (
                <li>
                  Focus on top segment &quot;{dashboard.topSegments[0].name}&quot; for growth initiatives.
                </li>
              )}
              {dashboard.regionBreakdown.length > 0 && (
                <li>
                  Highest revenue region: {dashboard.regionBreakdown[0].name}. Consider regional campaigns.
                </li>
              )}
              <li>Run trend analysis by segment and region for the next quarter.</li>
            </ul>
          </section>
        </>
      )}

      {/* Ask AI */}
      <section className={CARD_CLASS}>
        <h2 className="text-lg font-medium text-gray-900">{t("common.examplePrompts")}</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {suggestedPrompts.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setChatInput(p)}
              className="rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              {p}
            </button>
          ))}
        </div>
        <p className="mt-1.5 text-xs text-gray-400">{t("research.tabHint")}</p>
        <div className="mt-6 min-h-[200px] rounded-xl border border-gray-200 bg-gray-50 p-4">
          <div className="flex flex-col gap-3 overflow-y-auto max-h-64">
            {messages.map((m) => (
              <div
                key={m.id}
                className={
                  m.role === "assistant"
                    ? "self-start max-w-[85%] rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900"
                    : "self-end max-w-[85%] rounded-xl bg-gray-900 px-4 py-3 text-sm text-white"
                }
              >
                {m.id === "welcome" ? t("analyst.welcomeMessage") : m.content}
              </div>
            ))}
            {chatLoading && (
              <div className="self-start rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-500">
                {t("common.thinking")}
              </div>
            )}
          </div>
        </div>
        <form onSubmit={handleSubmitChat} className="mt-4 flex gap-3">
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={handleChatKeyDown}
            placeholder={t("analyst.askQuestion")}
            disabled={chatLoading}
            className="min-h-[44px] flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={chatLoading || !chatInput.trim()}
            className="btn-primary min-h-[44px] px-5 disabled:opacity-60"
          >
            {t("common.send")}
          </button>
        </form>
      </section>
    </div>
  );
}
