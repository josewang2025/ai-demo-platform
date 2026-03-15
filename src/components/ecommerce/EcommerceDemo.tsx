"use client";

import { useRef, useState, useMemo, useCallback } from "react";
import Papa from "papaparse";
import { SHOPIFY_SAMPLE_DATA, type ShopifyRow } from "./shopifySampleData";
import {
  computeShopifyDashboard,
  buildShopifyDatasetSummary,
} from "./shopifyDashboardUtils";
import { ECOMMERCE_CONSULTANT_PROMPT } from "./ecommerceConsultantPrompt";
import { MetricCard } from "@/components/ui";

const CARD_CLASS =
  "rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md";

const SHOPIFY_COLUMNS = [
  "date",
  "product_name",
  "category",
  "orders",
  "units_sold",
  "revenue",
  "ad_spend",
  "conversion_rate",
  "inventory",
];

function parseShopifyCsv(csvText: string): ShopifyRow[] {
  const result = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
  });
  if (result.errors.length > 0) {
    throw new Error(result.errors.map((e) => e.message).join("; "));
  }
  const rows = result.data;
  if (rows.length === 0) return [];

  const norm = (s: string) =>
    s.trim().toLowerCase().replace(/\s+/g, "_").replace(/-/g, "_");
  const keys = Object.keys(rows[0]).map((k) => norm(k));
  const expected = SHOPIFY_COLUMNS.map((c) => norm(c));
  const missing = expected.filter((c) => !keys.includes(c));
  if (missing.length > 0) {
    throw new Error(
      `Missing columns: ${missing.join(", ")}. Use template: /ecommerce_template.csv`
    );
  }

  const get = (row: Record<string, string>, col: string) => {
    const key = Object.keys(row).find((k) => norm(k) === norm(col));
    return (key ? row[key] : "") ?? "";
  };

  return rows.map((row) => ({
    date: get(row, "date").trim(),
    product_name: get(row, "product_name").trim(),
    category: get(row, "category").trim(),
    orders: parseInt(get(row, "orders") || "0", 10) || 0,
    units_sold: parseInt(get(row, "units_sold") || "0", 10) || 0,
    revenue: parseFloat(get(row, "revenue") || "0") || 0,
    ad_spend: parseFloat(get(row, "ad_spend") || "0") || 0,
    conversion_rate: parseFloat(get(row, "conversion_rate") || "0") || 0,
    inventory: parseInt(get(row, "inventory") || "0", 10) || 0,
  }));
}

type ChatMessage = { id: string; role: "user" | "assistant"; content: string };

const INITIAL_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Load your data above, then ask a business question or click **Generate full report** for a consultant-style analysis.",
};

const EXAMPLE_QUESTIONS = [
  "Which products are driving most of the revenue?",
  "Are there any underperforming products?",
  "What trends do you see in the sales data?",
  "Which products should we promote more?",
  "What are the biggest risks in this store right now?",
];

const ANALYSIS_FOCUS_OPTIONS = [
  { value: "sales" as const, label: "Sales" },
  { value: "products" as const, label: "Products" },
  { value: "campaigns" as const, label: "Campaigns" },
  { value: "customers" as const, label: "Customers" },
];

const FULL_REPORT_PROMPT =
  "Generate a full analyst report using the dataset summary. Structure your response with: Executive Summary, Key Metrics Snapshot, Product Performance Insights, Revenue & Trend Signals, and Recommended Next Actions. Include at least one non-obvious risk or insight.";

type EcommerceDemoProps = {
  modelProvider?: "auto" | "openai" | "anthropic" | "gemini";
  outputLanguage?: "en" | "zh";
};

export function EcommerceDemo({
  modelProvider = "auto",
  outputLanguage = "en",
}: EcommerceDemoProps) {
  const inputSectionRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [data, setData] = useState<ShopifyRow[] | null>(() => SHOPIFY_SAMPLE_DATA);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [analysisFocus, setAnalysisFocus] = useState<
    "sales" | "products" | "campaigns" | "customers"
  >("sales");
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [chatLoading, setChatLoading] = useState(false);

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

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> =
    useCallback((e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setParseError(null);
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = parseShopifyCsv(String(reader.result));
          setData(parsed);
          setUploadedFileName(file.name);
        } catch (err) {
          setParseError(
            err instanceof Error ? err.message : "Failed to parse CSV"
          );
          setUploadedFileName(null);
        }
      };
      reader.readAsText(file, "UTF-8");
      e.target.value = "";
    }, []);

  const handleDrop: React.DragEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (!file) return;
      setParseError(null);
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = parseShopifyCsv(String(reader.result));
          setData(parsed);
          setUploadedFileName(file.name);
        } catch (err) {
          setParseError(
            err instanceof Error ? err.message : "Failed to parse CSV"
          );
          setUploadedFileName(null);
        }
      };
      reader.readAsText(file, "UTF-8");
    },
    []
  );

  const handleDragOver: React.DragEventHandler<HTMLDivElement> = (e) =>
    e.preventDefault();

  const scrollToInput = useCallback(() => {
    inputSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const triggerUpload = useCallback(() => {
    scrollToInput();
    setTimeout(() => fileInputRef.current?.click(), 400);
  }, [scrollToInput]);

  const apiProvider =
    modelProvider === "auto" ? "openai" : modelProvider;

  const handleSubmitChat = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const trimmed = chatInput.trim();
      if (!trimmed || chatLoading) return;

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: trimmed,
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
            input: trimmed,
            provider: apiProvider,
            outputLanguage,
            systemPromptOverride: systemPrompt,
            taskHint: "ecommerce",
          }),
        });
        const body = (await res.json()) as { success?: boolean; reply?: string; error?: string };
        const reply = body.success && body.reply
          ? body.reply
          : body.error === "rate_limit_exceeded"
            ? "Too many requests. Please try again in a minute."
            : body.error === "provider_unavailable"
              ? "AI provider unavailable. Add API keys in Environment Variables."
              : body.reply ??
          "Something went wrong. Try again.";
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
            content: "Something went wrong. Check your connection and try again.",
          },
        ]);
      } finally {
        setChatLoading(false);
      }
    },
    [chatInput, chatLoading, datasetSummary, outputLanguage, apiProvider]
  );

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
            provider: apiProvider,
            outputLanguage,
            systemPromptOverride: systemPrompt,
            taskHint: "ecommerce",
          }),
        });
        const body = (await res.json()) as { success?: boolean; reply?: string; error?: string };
        const reply = body.success && body.reply
          ? body.reply
          : body.error === "rate_limit_exceeded"
            ? "Too many requests. Please try again in a minute."
            : body.error === "provider_unavailable"
              ? "AI provider unavailable. Add API keys in Environment Variables."
              : body.reply ?? "Something went wrong. Try again.";
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
            content: "Something went wrong. Check your connection and try again.",
          },
        ]);
      } finally {
        setChatLoading(false);
      }
    },
    [chatLoading, datasetSummary, outputLanguage, apiProvider]
  );

  const handleGenerateFullReport = useCallback(() => {
    sendMessage(FULL_REPORT_PROMPT);
  }, [sendMessage]);

  const handleClearChat = useCallback(() => {
    setMessages([INITIAL_MESSAGE]);
  }, []);

  const hasData = data !== null && data.length > 0;
  const isSample = hasData && !uploadedFileName;

  return (
    <div className="mt-10 space-y-14">
      {/* Hero */}
      <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm md:p-10">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          AI Ecommerce Analyst
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-gray-600">
          Turn store data into clear insights, trend signals, and growth
          recommendations.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          The right model for the right task — routed automatically for
          business use cases.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <button
            type="button"
            onClick={handleUseSample}
            className="btn-primary"
          >
            Try Sample Data
          </button>
          <button
            type="button"
            onClick={triggerUpload}
            className="btn-secondary"
          >
            Upload CSV
          </button>
        </div>
      </section>

      {/* Input panel */}
      <section ref={inputSectionRef} className={CARD_CLASS}>
        <h2 className="text-lg font-medium text-gray-900">Your data</h2>
        {hasData && (
          <p className="mt-2 text-sm text-gray-600">
            {isSample
              ? `Sample dataset (${data!.length} rows)`
              : `Loaded: ${uploadedFileName} (${data!.length} rows)`}
          </p>
        )}
        <div
          className="mt-6 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/80 px-6 py-10 text-center"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <p className="text-sm font-medium text-gray-900">
            Drag & drop a CSV here
          </p>
          <p className="mt-1.5 text-sm text-gray-500">
            Or use the sample dataset or choose a file. Columns: date,
            product_name, category, orders, units_sold, revenue, ad_spend,
            conversion_rate, inventory.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn-secondary py-2.5 px-4"
            >
              Choose file
            </button>
            <a
              href="/ecommerce_template.csv"
              download="ecommerce_template.csv"
              className="btn-secondary inline-block py-2.5 px-4"
            >
              Download CSV Template
            </a>
            <button
              type="button"
              onClick={handleUseSample}
              className="btn-secondary py-2.5 px-4"
            >
              Use Sample Dataset
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
            Analysis focus
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
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm font-medium text-gray-700">
            Example Questions
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {EXAMPLE_QUESTIONS.map((q, i) => (
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
        <section aria-label="Performance overview">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Performance Overview
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <MetricCard
              label="Total Revenue"
              value={`$${dashboard.totalRevenue.toLocaleString("en-US", {
                maximumFractionDigits: 0,
              })}`}
            />
            <MetricCard
              label="Orders"
              value={dashboard.totalOrders.toLocaleString()}
            />
            <MetricCard
              label="Avg Conversion"
              value={`${dashboard.avgConversionRate.toFixed(2)}%`}
            />
            <MetricCard label="Top Product" value={dashboard.topProduct} />
            <MetricCard
              label="Inventory Risk"
              value={
                dashboard.lowInventoryRisk.length > 0
                  ? dashboard.lowInventoryRisk.join(", ")
                  : "None"
              }
            />
          </div>
        </section>
      )}

      {/* Store Signals */}
      {dashboard && (
        <section
          aria-label="Store signals"
          className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]"
        >
          <h2 className="text-lg font-medium text-gray-900 col-span-full">
            Store Signals
          </h2>
          <div className={CARD_CLASS}>
            <h3 className="text-base font-medium text-gray-900">Revenue Trend</h3>
            <p className="mt-1 text-sm text-gray-500">Daily revenue</p>
            {dashboard.revenueByDate.length > 0 && (
              <RevenueTrendChart data={dashboard.revenueByDate} />
            )}
          </div>
          <div className={CARD_CLASS}>
            <h3 className="text-base font-medium text-gray-900">
              Product Performance
            </h3>
            <p className="mt-1 text-sm text-gray-500">By revenue</p>
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
              AI Analysis Report
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Consultant-style insights from your data. Ask a question or
              generate a full report.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleGenerateFullReport}
              disabled={!hasData || chatLoading}
              className="btn-secondary py-2 px-4 text-sm disabled:opacity-60"
            >
              Generate full report
            </button>
            <button
              type="button"
              onClick={handleClearChat}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="mt-6 min-h-[280px] rounded-xl border border-gray-200 bg-gray-50/50 p-5 shadow-inner">
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
                ) : (
                  <ReportMarkdown content={m.content} />
                )}
              </div>
            ))}
            {chatLoading && (
              <div className="flex items-center gap-2 py-4 text-gray-500">
                <span className="h-2 w-2 animate-pulse rounded-full bg-gray-400" />
                Generating analysis…
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmitChat} className="mt-4 flex gap-3">
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="e.g. Which products should we promote more?"
            disabled={chatLoading || !hasData}
            className="min-h-[44px] flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={chatLoading || !chatInput.trim() || !hasData}
            className="btn-primary min-h-[44px] px-5 disabled:opacity-60"
          >
            Send
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
