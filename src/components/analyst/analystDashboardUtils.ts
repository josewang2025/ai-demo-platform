import type { AnalystRow } from "./analystSampleData";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export type AnalystDashboardData = {
  totalRevenue: number;
  totalOrders: number;
  totalProfit: number;
  totalCustomers: number;
  revenueByMonth: { month: string; value: number }[];
  topSegments: { name: string; value: number }[];
  regionBreakdown: { name: string; value: number }[];
};

export function computeAnalystDashboard(rows: AnalystRow[]): AnalystDashboardData {
  if (rows.length === 0) {
    return {
      totalRevenue: 0,
      totalOrders: 0,
      totalProfit: 0,
      totalCustomers: 0,
      revenueByMonth: [],
      topSegments: [],
      regionBreakdown: [],
    };
  }

  const totalRevenue = rows.reduce((s, r) => s + r.revenue, 0);
  const totalOrders = rows.reduce((s, r) => s + r.orders, 0);
  const totalProfit = rows.reduce((s, r) => s + r.profit, 0);
  const totalCustomers = rows.reduce((s, r) => s + r.customer_count, 0);

  const byMonth = new Map<string, number>();
  for (const r of rows) {
    const ym = r.date.slice(0, 7);
    byMonth.set(ym, (byMonth.get(ym) ?? 0) + r.revenue);
  }
  const sortedMonths = Array.from(byMonth.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  const revenueByMonth = sortedMonths.map(([ym, value]) => {
    const [, m] = ym.split("-");
    return { month: MONTHS[parseInt(m, 10) - 1] ?? ym, value };
  });

  const bySegment = new Map<string, number>();
  for (const r of rows) {
    bySegment.set(r.segment, (bySegment.get(r.segment) ?? 0) + r.revenue);
  }
  const topSegments = Array.from(bySegment.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  const byRegion = new Map<string, number>();
  for (const r of rows) {
    byRegion.set(r.region, (byRegion.get(r.region) ?? 0) + r.revenue);
  }
  const regionBreakdown = Array.from(byRegion.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  return {
    totalRevenue,
    totalOrders,
    totalProfit,
    totalCustomers,
    revenueByMonth,
    topSegments,
    regionBreakdown,
  };
}

export function buildAnalystDatasetSummary(rows: AnalystRow[]): string {
  const d = computeAnalystDashboard(rows);
  const lines: string[] = [];
  lines.push(`Total revenue: $${d.totalRevenue.toLocaleString("en-US", { maximumFractionDigits: 0 })}`);
  lines.push(`Total orders: ${d.totalOrders}`);
  lines.push(`Total profit: $${d.totalProfit.toLocaleString("en-US", { maximumFractionDigits: 0 })}`);
  lines.push(`Total customer count (aggregate): ${d.totalCustomers}`);
  if (d.revenueByMonth.length > 0) {
    lines.push("Revenue by month: " + d.revenueByMonth.map((m) => `${m.month} $${m.value.toFixed(0)}`).join(", "));
  }
  if (d.topSegments.length > 0) {
    lines.push("Revenue by segment: " + d.topSegments.map((s) => `${s.name} $${s.value.toFixed(0)}`).join(", "));
  }
  if (d.regionBreakdown.length > 0) {
    lines.push("Revenue by region: " + d.regionBreakdown.map((r) => `${r.name} $${r.value.toFixed(0)}`).join(", "));
  }
  return lines.join("\n");
}
