"use client";

import { useRef, useState, useMemo, useCallback } from "react";
import Papa from "papaparse";
import { SAMPLE_ORDERS, type OrderRow } from "@/components/ecommerce/sampleOrders";
import { computeDashboard, buildDatasetSummary } from "@/components/ecommerce/dashboardUtils";
import { MetricCard } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { getResolvedProviderForApi, type ModelProvider } from "@/components/demo";

const CARD_CLASS = "card";

const EXPECTED_COLUMNS = [
  "date",
  "order_id",
  "product",
  "category",
  "price",
  "quantity",
  "revenue",
  "customer",
  "country",
  "channel",
];

function parseCsvToOrders(csvText: string): OrderRow[] {
  const result = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
  });
  if (result.errors.length > 0) throw new Error(result.errors.map((e) => e.message).join("; "));
  const rows = result.data;
  if (rows.length === 0) return [];
  const first = rows[0];
  const keys = Object.keys(first).map((k) => k.trim().toLowerCase().replace(/\s+/g, "_"));
  const normalizedExpected = EXPECTED_COLUMNS.map((c) => c.toLowerCase().replace(/\s+/g, "_"));
  const missing = normalizedExpected.filter((c) => !keys.includes(c));
  if (missing.length > 0) throw new Error(`Missing columns: ${missing.join(", ")}.`);
  const get = (row: Record<string, string>, col: string) => {
    const n = col.toLowerCase().replace(/\s+/g, "_");
    const key = Object.keys(row).find((k) => k.trim().toLowerCase().replace(/\s+/g, "_") === n);
    return (key ? row[key] : "") ?? "";
  };
  return rows.map((row, i) => {
    const date = get(row, "date").trim();
    const order_id = get(row, "order_id").trim() || String(1000 + i + 1);
    const product = get(row, "product").trim();
    const category = get(row, "category").trim();
    const price = parseFloat(get(row, "price") || "0") || 0;
    const quantity = parseInt(get(row, "quantity") || "0", 10) || 0;
    const rev = parseFloat(get(row, "revenue") || "0");
    const revenue = rev > 0 ? rev : price * quantity;
    const customer = get(row, "customer").trim() || `unknown_${i}`;
    const country = get(row, "country").trim() || "";
    const channel = get(row, "channel").trim() || "";
    return { date, order_id, product, category, price, quantity, revenue, customer, country, channel };
  });
}

type ChatMessage = { id: number | string; role: "user" | "assistant"; content: string };

export function AnalystDemo({
  modelProvider = "auto",
  outputLanguage = "en",
}: {
  modelProvider?: ModelProvider;
  outputLanguage?: "en" | "zh";
}) {
  const { t } = useLanguage();
  const [orders, setOrders] = useState<OrderRow[] | null>(() => SAMPLE_ORDERS);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "welcome", role: "assistant", content: "" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const dashboard = useMemo(() => (orders ? computeDashboard(orders) : null), [orders]);
  const datasetSummary = useMemo(() => (orders ? buildDatasetSummary(orders) : ""), [orders]);
  const hasData = orders !== null && orders.length > 0;

  const handleUseSample = useCallback(() => {
    setOrders(SAMPLE_ORDERS);
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
        const parsed = parseCsvToOrders(String(reader.result));
        setOrders(parsed);
        setUploadedFileName(file.name);
      } catch (err) {
        setParseError(err instanceof Error ? err.message : "Failed to parse CSV");
      }
    };
    reader.readAsText(file, "UTF-8");
    e.target.value = "";
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
            ...(datasetSummary ? { datasetSummary } : {}),
          }),
        });
        const data = (await res.json()) as { success?: boolean; reply?: string; error?: string };
        const message = data.success && data.reply
          ? data.reply
          : data.error === "rate_limit_exceeded"
            ? t("errors.rateLimit")
            : data.error === "provider_unavailable"
              ? t("errors.providerUnavailable")
              : data.reply ?? t("analyst.couldNotGenerate");
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
    [chatInput, chatLoading, datasetSummary, modelProvider, outputLanguage, t]
  );

  const suggestedPrompts = [
    t("analyst.suggested1"),
    t("analyst.suggested2"),
    t("analyst.suggested3"),
  ];

  return (
    <>
      {/* Input */}
      <section className={CARD_CLASS}>
        <h2 className="text-lg font-medium text-gray-900">{t("analyst.uploadLabel")}</h2>
        <p className="mt-2 text-sm text-gray-600">{t("analyst.uploadHint")}</p>
        <div
          className="mt-6 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 py-10 text-center"
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files?.[0];
            if (!file) return;
            setParseError(null);
            const reader = new FileReader();
            reader.onload = () => {
              try {
                const parsed = parseCsvToOrders(String(reader.result));
                setOrders(parsed);
                setUploadedFileName(file.name);
              } catch (err) {
                setParseError(err instanceof Error ? err.message : "Failed to parse");
              }
            };
            reader.readAsText(file, "UTF-8");
          }}
          onDragOver={(e) => e.preventDefault()}
        >
          <p className="text-sm font-medium text-gray-900">Drag & drop CSV or choose file</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => fileInputRef.current?.click()} className="btn-secondary py-2.5 px-4">
              {t("common.chooseFile")}
            </button>
            <button type="button" onClick={handleUseSample} className="btn-secondary py-2.5 px-4">
              {t("common.useSampleData")}
            </button>
          </div>
          <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
          {parseError && <p className="mt-4 text-sm text-red-600">{parseError}</p>}
          {hasData && (
            <p className="mt-4 text-sm text-gray-500">
              {uploadedFileName ? `${t("common.loaded")} ${uploadedFileName}` : t("common.usingSampleData")} ({orders!.length} {t("common.rows")})
            </p>
          )}
        </div>
      </section>

      {/* Output: Executive Summary, KPI Snapshot, Trend Analysis, Suggested Actions */}
      {dashboard && (
        <>
          <section className={CARD_CLASS}>
            <h2 className="text-lg font-medium text-gray-900">{t("analyst.execSummary")}</h2>
            <p className="mt-3 text-sm text-gray-700 leading-relaxed">
              Total revenue ${dashboard.totalRevenue.toLocaleString("en-US", { maximumFractionDigits: 0 })} across {dashboard.orderCount} orders.
              Average order value ${dashboard.aov.toLocaleString("en-US", { maximumFractionDigits: 2 })}. {dashboard.uniqueCustomers} unique customers; {dashboard.returningCustomerRate.toFixed(1)}% returning rate.
            </p>
          </section>

          <section className={CARD_CLASS} aria-label="KPI Snapshot">
            <h2 className="text-lg font-medium text-gray-900">{t("analyst.kpiSnapshot")}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard label="Revenue" value={`$${dashboard.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
              <MetricCard label="Orders" value={dashboard.orderCount.toLocaleString()} />
              <MetricCard label="AOV" value={`$${dashboard.aov.toLocaleString("en-US", { maximumFractionDigits: 2 })}`} />
              <MetricCard label="Returning rate" value={`${dashboard.returningCustomerRate.toFixed(1)}%`} />
            </div>
          </section>

          <section className={CARD_CLASS}>
            <h2 className="text-lg font-medium text-gray-900">{t("analyst.trendAnalysis")}</h2>
            <p className="mt-2 text-sm text-gray-500">Revenue by month</p>
            {dashboard.revenueByMonth.length > 0 ? (
              <ul className="mt-4 space-y-2">
                {dashboard.revenueByMonth.map((m) => (
                  <li key={m.month} className="flex justify-between text-sm">
                    <span className="text-gray-700">{m.month}</span>
                    <span className="font-medium text-gray-900">${m.value.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-gray-500">No trend data yet.</p>
            )}
          </section>

          <section className={CARD_CLASS}>
            <h2 className="text-lg font-medium text-gray-900">{t("analyst.suggestedActions")}</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-gray-700">
              {dashboard.topProducts.length > 0 && (
                <li>Focus on top product &quot;{dashboard.topProducts[0].name}&quot; for promotions.</li>
              )}
              {dashboard.returningCustomerRate > 0 && <li>Improve retention; {dashboard.returningCustomerRate.toFixed(0)}% of orders are from repeat customers.</li>}
              <li>Run a cohort analysis by channel and country for next quarter.</li>
            </ul>
          </section>
        </>
      )}

      {/* Ask questions */}
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
            placeholder={t("analyst.askQuestion")}
            disabled={chatLoading}
            className="min-h-[44px] flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 disabled:opacity-60"
          />
          <button type="submit" disabled={chatLoading || !chatInput.trim()} className="btn-primary min-h-[44px] px-5 disabled:opacity-60">
            {t("common.send")}
          </button>
        </form>
      </section>
    </>
  );
}
