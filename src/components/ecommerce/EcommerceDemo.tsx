"use client";

import { useRef, useState, useMemo, useCallback } from "react";
import { parseCsv } from "@/lib/csvParser";
import { SHOPIFY_SAMPLE_DATA, type ShopifyRow } from "./shopifySampleData";
import {
  computeShopifyDashboard,
  buildShopifyDatasetSummary,
} from "./shopifyDashboardUtils";
import { ECOMMERCE_CONSULTANT_PROMPT } from "./ecommerceConsultantPrompt";
import { MetricCard } from "@/components/ui/legacy";
import { getResolvedProviderForApi, type ModelProvider } from "@/components/demo";
import { useLanguage } from "@/contexts/LanguageContext";
import { resolveApiReply, type AnalyzeApiResponse } from "@/lib/apiResponse";
import { useFileUpload } from "@/hooks/useFileUpload";

const CARD_CLASS =
  "rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md";

const SHOPIFY_COLUMNS = [
  "date", "product_name", "category", "orders", "units_sold",
  "revenue", "ad_spend", "conversion_rate", "inventory",
];

function parseShopifyCsv(csvText: string): ShopifyRow[] {
  return parseCsv<ShopifyRow>(csvText, SHOPIFY_COLUMNS, "/ecommerce_template.csv", (get) => ({
    date: get("date").trim(),
    product_name: get("product_name").trim(),
    category: get("category").trim(),
    orders: parseInt(get("orders") || "0", 10) || 0,
    units_sold: parseInt(get("units_sold") || "0", 10) || 0,
    revenue: parseFloat(get("revenue") || "0") || 0,
    ad_spend: parseFloat(get("ad_spend") || "0") || 0,
    conversion_rate: parseFloat(get("conversion_rate") || "0") || 0,
    inventory: parseInt(get("inventory") || "0", 10) || 0,
  }));
}

type ChatMessage = { id: string; role: "user" | "assistant"; content: string };

const ANALYSIS_FOCUS_OPTIONS = [
  { value: "sales" as const, labelKey: "ecommerce.focusSales" as const },
  { value: "products" as const, labelKey: "ecommerce.focusProducts" as const },
  { value: "campaigns" as const, labelKey: "ecommerce.focusCampaigns" as const },
  { value: "customers" as const, labelKey: "ecommerce.focusCustomers" as const },
] as const;

const FULL_REPORT_PROMPT =
  "Generate a full analyst report using the dataset summary. Structure your response with: Executive Summary, Key Metrics Snapshot, Product Performance Insights, Revenue & Trend Signals, and Recommended Next Actions. Include at least one non-obvious risk or insight.";

type EcommerceDemoProps = {
  modelProvider?: ModelProvider;
  outputLanguage?: "en" | "zh";
  responseMode?: "fast" | "deep" | "research";
  reportStyle?: "concise" | "executive" | "detailed";
};

export function EcommerceDemo({
  modelProvider = "auto",
  outputLanguage = "en",
  responseMode = "fast",
  reportStyle = "concise",
}: EcommerceDemoProps) {
  const { t } = useLanguage();

  const [data, setData] = useState<ShopifyRow[] | null>(() => SHOPIFY_SAMPLE_DATA);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [analysisFocus, setAnalysisFocus] = useState<
    "sales" | "products" | "campaigns" | "customers"
  >("sales");
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "welcome", role: "assistant", content: "" },
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  const { fileInputRef, sectionRef: inputSectionRef, handleFileChange, handleDrop, handleDragOver, triggerUpload } =
    useFileUpload<ShopifyRow>({
      parse: parseShopifyCsv,
      onData: (rows, fileName) => {
        setData(rows);
        setUploadedFileName(fileName);
        setParseError(null);
      },
      onError: (msg) => {
        setParseError(msg);
        setUploadedFileName(null);
      },
    });

  const exampleQuestions = [
    t("ecommerce.exampleQ1"),
    t("ecommerce.exampleQ2"),
    t("ecommerce.exampleQ3"),
    t("ecommerce.exampleQ4"),
    t("ecommerce.exampleQ5"),
  ];
  const firstSuggestionRef = useRef(exampleQuestions[0]);
  firstSuggestionRef.current = exampleQuestions[0];

  const dashboard = useMemo(
    () => (data ? computeShopifyDashboard(data) : null),
    [data]
  );
  const datasetSummary = useMemo(
    () => (data ? buildShopifyDatasetSummary(data) : ""),
    [data]
  );

  const handleUseSample = useCallback(() => {
    setData(SHOPIFY_SAMPLE_DATA);
    setUploadedFileName(null);
    setParseError(null);
  }, []);

  const providerForApi = getResolvedProviderForApi(modelProvider ?? "auto");

  const sendMessage = useCallback(
    async (messageText: string) => {
      if (!messageText.trim() || chatLoading) return;
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: messageText.trim(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setChatInput("");
      setChatLoading(true);
      const systemPrompt =
        ECOMMERCE_CONSULTANT_PROMPT +
        "\n\nDataset summary:\n" +
        datasetSummary;
      try {
        const res = await fetch("/api/ai/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            input: messageText.trim(),
            provider: providerForApi,
            outputLanguage,
            responseMode,
            reportStyle,
            systemPromptOverride: systemPrompt,
            taskHint: "ecommerce",
          }),
        });
        const body = (await res.json()) as AnalyzeApiResponse;
        const reply = resolveApiReply(body, t);
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
            content: t("errors.generic"),
          },
        ]);
      } finally {
        setChatLoading(false);
      }
    },
    [chatLoading, datasetSummary, outputLanguage, providerForApi, responseMode, reportStyle, t]
  );

  const handleSubmitChat = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      sendMessage(chatInput.trim());
    },
    [chatInput, sendMessage]
  );

  const handleGenerateFullReport = useCallback(() => {
    sendMessage(FULL_REPORT_PROMPT);
  }, [sendMessage]);

  const handleClearChat = useCallback(() => {
    setMessages([{ id: "welcome", role: "assistant", content: "" }]);
  }, []);

  const hasData = data !== null && data.length > 0;
  const isSample = hasData && !uploadedFileName;

  return (
    <div className="mt-10 space-y-14">
      {/* Hero */}
      <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm md:p-10">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          {t("ecommerce.heroTitle")}
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-gray-600">
          {t("ecommerce.heroSubtitle")}
        </p>
        <p className="mt-2 text-sm text-gray-500">
          {t("ecommerce.heroSupport")}
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <button
            type="button"
            onClick={handleUseSample}
            className="btn-primary"
          >
            {t("ecommerce.trySampleData")}
          </button>
          <button
            type="button"
            onClick={triggerUpload}
            className="btn-secondary"
          >
            {t("ecommerce.uploadCsv")}
          </button>
        </div>
      </section>

      {/* Input panel */}
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
          onDragOver={handleDragOver}
        >
          <p className="text-sm font-medium text-gray-900">
            {t("common.dragDropCsv")}
          </p>
          <p className="mt-1.5 text-sm text-gray-500">
            {t("ecommerce.uploadHintColumns")}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn-secondary py-2.5 px-4"
            >
              {t("common.chooseFile")}
            </button>
            <a
              href="/ecommerce_template.csv"
              download="ecommerce_template.csv"
              className="btn-secondary inline-block py-2.5 px-4"
            >
              {t("common.downloadTemplate")}
            </a>
            <button
              type="button"
              onClick={handleUseSample}
              className="btn-secondary py-2.5 px-4"
            >
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
          {parseError && (
            <p className="mt-4 text-sm text-red-600">{parseError}</p>
          )}
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700">
            {t("common.analysisFocus")}
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            {ANALYSIS_FOCUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setAnalysisFocus(opt.value)}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  analysisFocus === opt.value
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {t(opt.labelKey)}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm font-medium text-gray-700">
            {t("common.exampleQuestions")}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {exampleQuestions.map((q, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setChatInput(q)}
                className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-left text-sm text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Performance Overview */}
      {dashboard && (
        <section aria-label={t("common.performanceOverview")}>
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {t("common.performanceOverview")}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <MetricCard
              label={t("ecommerce.totalRevenue")}
              value={`$${dashboard.totalRevenue.toLocaleString("en-US", {
                maximumFractionDigits: 0,
              })}`}
            />
            <MetricCard
              label={t("ecommerce.orders")}
              value={dashboard.totalOrders.toLocaleString()}
            />
            <MetricCard
              label={t("ecommerce.avgConversion")}
              value={`${dashboard.avgConversionRate.toFixed(2)}%`}
            />
            <MetricCard label={t("ecommerce.topProduct")} value={dashboard.topProduct} />
            <MetricCard
              label={t("ecommerce.inventoryRisk")}
              value={
                dashboard.lowInventoryRisk.length > 0
                  ? dashboard.lowInventoryRisk.join(", ")
                  : t("common.none")
              }
            />
          </div>
        </section>
      )}

      {/* Store Signals */}
      {dashboard && (
        <section
          aria-label={t("common.storeSignals")}
          className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]"
        >
          <h2 className="text-lg font-medium text-gray-900 col-span-full">
            {t("common.storeSignals")}
          </h2>
          <div className={CARD_CLASS}>
            <h3 className="text-base font-medium text-gray-900">{t("ecommerce.revenueTrend")}</h3>
            <p className="mt-1 text-sm text-gray-500">{t("ecommerce.dailyRevenue")}</p>
            {dashboard.revenueByDate.length > 0 && (
              <RevenueTrendChart data={dashboard.revenueByDate} />
            )}
          </div>
          <div className={CARD_CLASS}>
            <h3 className="text-base font-medium text-gray-900">
              {t("ecommerce.productPerformanceChart")}
            </h3>
            <p className="mt-1 text-sm text-gray-500">{t("ecommerce.byRevenue")}</p>
            {dashboard.productPerformance.length > 0 && (
              <ProductPerformanceChart data={dashboard.productPerformance} />
            )}
          </div>
        </section>
      )}

      {/* AI analysis results */}
      <section className={CARD_CLASS}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-medium text-gray-900">
              {t("common.aiAnalysisReport")}
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              {t("ecommerce.consultantInsights")}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleGenerateFullReport}
              disabled={!hasData || chatLoading}
              className="btn-secondary py-2 px-4 text-sm disabled:opacity-60"
            >
              {t("common.generateFullReport")}
            </button>
            <button
              type="button"
              onClick={handleClearChat}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {t("common.clear")}
            </button>
          </div>
        </div>

        <div className="mt-6 min-h-[280px] rounded-xl border border-gray-200 bg-gray-50/50 p-5 shadow-inner" role="log" aria-live="polite">
          <div className="max-h-[420px] overflow-y-auto">
            {messages.map((m) => (
              <div
                key={m.id}
                className={
                  m.role === "assistant"
                    ? "report-content text-sm text-gray-800"
                    : "mb-4 flex justify-end"
                }
              >
                {m.role === "user" ? (
                  <span className="max-w-[85%] rounded-xl bg-gray-900 px-4 py-2.5 text-white">
                    {m.content}
                  </span>
                ) : m.id === "welcome" ? (
                  <ReportMarkdown content={t("ecommerce.welcomeMessage")} />
                ) : (
                  <ReportMarkdown content={m.content} />
                )}
              </div>
            ))}
            {chatLoading && (
              <div className="flex items-center gap-2 py-4 text-gray-500" aria-busy="true">
                <span className="h-2 w-2 animate-pulse rounded-full bg-gray-400" aria-hidden="true" />
                {t("ecommerce.generating")}
              </div>
            )}
          </div>
        </div>

        <p className="mt-1.5 text-xs text-gray-400">{t("research.tabHint")}</p>
        <form onSubmit={handleSubmitChat} className="mt-4 flex gap-3">
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== "Tab") return;
              const s = firstSuggestionRef.current;
              if (!s) return;
              const trimmed = chatInput.trim();
              if (trimmed.length === 0 || s.toLowerCase().startsWith(trimmed.toLowerCase())) {
                e.preventDefault();
                setChatInput(s);
              }
            }}
            placeholder={t("ecommerce.askPlaceholder")}
            disabled={chatLoading || !hasData}
            className="min-h-[44px] flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={chatLoading || !chatInput.trim() || !hasData}
            className="btn-primary min-h-[44px] px-5 disabled:opacity-60"
          >
            {t("common.send")}
          </button>
        </form>
      </section>
    </div>
  );
}

function ReportMarkdown({ content }: { content: string }) {
  const parts = content.split(/(?=^##\s)/m).filter(Boolean);
  if (parts.length === 0) {
    return (
      <div className="whitespace-pre-wrap text-gray-800">{content}</div>
    );
  }
  return (
    <div className="report-content space-y-6">
      {parts.map((block, i) => {
        const firstLineEnd = block.indexOf("\n");
        const firstLine =
          firstLineEnd === -1 ? block : block.slice(0, firstLineEnd);
        const rest =
          firstLineEnd === -1 ? "" : block.slice(firstLineEnd + 1).trim();
        const heading = firstLine.replace(/^##\s*/, "");
        return (
          <div key={i}>
            <h3 className="text-base font-semibold text-gray-900">
              {heading}
            </h3>
            <div className="mt-2 whitespace-pre-wrap text-gray-700">
              {rest}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RevenueTrendChart({
  data,
}: {
  data: { date: string; value: number }[];
}) {
  if (data.length === 0) return null;
  const max = Math.max(...data.map((d) => d.value), 1);
  const width = 400;
  const height = 180;
  const padding = { top: 20, right: 20, bottom: 30, left: 50 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;
  const points = data
    .map((d, i) => {
      const x =
        padding.left +
        (data.length === 1 ? 0 : (i / (data.length - 1)) * innerW);
      const y =
        padding.top + innerH - (d.value / max) * innerH;
      return `${x},${y}`;
    })
    .join(" ");
  const labels = data.filter((_, i) => i % 2 === 0 || data.length <= 7);
  return (
    <div className="mt-4">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-48 w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <polyline
          fill="none"
          stroke="rgb(14, 165, 233)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
      <div className="mt-2 flex flex-wrap justify-between gap-1 text-xs text-gray-500">
        {labels.map((_, i) => {
          const idx = data.length <= 7 ? i : i * 2;
          const d = data[idx];
          return d ? <span key={d.date}>{d.date}</span> : null;
        })}
      </div>
    </div>
  );
}

function ProductPerformanceChart({
  data,
}: {
  data: { name: string; revenue: number; units_sold: number }[];
}) {
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);
  return (
    <div className="mt-4 space-y-4">
      {data.slice(0, 6).map((p) => (
        <div key={p.name} className="flex items-center gap-4">
          <span className="w-32 shrink-0 truncate text-sm font-medium text-gray-700">
            {p.name}
          </span>
          <div className="min-w-0 flex-1">
            <div className="h-8 overflow-hidden rounded-lg bg-gray-100">
              <div
                className="h-full rounded-lg bg-sky-500"
                style={{
                  width: `${(p.revenue / maxRevenue) * 100}%`,
                }}
              />
            </div>
          </div>
          <span className="w-16 shrink-0 text-right text-sm font-medium text-gray-600">
            ${(p.revenue / 1000).toFixed(1)}k
          </span>
        </div>
      ))}
    </div>
  );
}
