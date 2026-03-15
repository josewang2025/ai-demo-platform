import type { ShopifyRow } from "./shopifySampleData";

export type ShopifyDashboard = {
  totalRevenue: number;
  totalOrders: number;
  avgConversionRate: number;
  topProduct: string;
  topProductRevenue: number;
  lowInventoryRisk: string[];
  revenueByDate: { date: string; value: number }[];
  productPerformance: { name: string; revenue: number; units_sold: number }[];
};

const INVENTORY_RISK_THRESHOLD = 25;

export function computeShopifyDashboard(rows: ShopifyRow[]): ShopifyDashboard {
  if (rows.length === 0) {
    return {
      totalRevenue: 0,
      totalOrders: 0,
      avgConversionRate: 0,
      topProduct: "—",
      topProductRevenue: 0,
      lowInventoryRisk: [],
      revenueByDate: [],
      productPerformance: [],
    };
  }

  const totalRevenue = rows.reduce((s, r) => s + r.revenue, 0);
  const totalOrders = rows.reduce((s, r) => s + r.orders, 0);
  const totalConv = rows.reduce((s, r) => s + r.conversion_rate * r.orders, 0);
  const avgConversionRate = totalOrders > 0 ? totalConv / totalOrders : 0;

  const byProduct = new Map<string, { revenue: number; units_sold: number; minInventory: number }>();
  for (const r of rows) {
    const cur = byProduct.get(r.product_name) ?? { revenue: 0, units_sold: 0, minInventory: r.inventory };
    cur.revenue += r.revenue;
    cur.units_sold += r.units_sold;
    cur.minInventory = Math.min(cur.minInventory, r.inventory);
    byProduct.set(r.product_name, cur);
  }

  const productPerformance = Array.from(byProduct.entries())
    .map(([name, v]) => ({ name, revenue: v.revenue, units_sold: v.units_sold }))
    .sort((a, b) => b.revenue - a.revenue);

  const topProduct = productPerformance[0]?.name ?? "—";
  const topProductRevenue = productPerformance[0]?.revenue ?? 0;

  const lowInventoryRisk = Array.from(byProduct.entries())
    .filter(([, v]) => v.minInventory <= INVENTORY_RISK_THRESHOLD)
    .map(([name]) => name);

  const byDate = new Map<string, number>();
  for (const r of rows) {
    byDate.set(r.date, (byDate.get(r.date) ?? 0) + r.revenue);
  }
  const revenueByDate = Array.from(byDate.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, value]) => ({ date, value }));

  return {
    totalRevenue,
    totalOrders,
    avgConversionRate,
    topProduct,
    topProductRevenue,
    lowInventoryRisk,
    revenueByDate,
    productPerformance,
  };
}

export function buildShopifyDatasetSummary(rows: ShopifyRow[]): string {
  const d = computeShopifyDashboard(rows);
  const lines: string[] = [];
  lines.push(`Total revenue: $${d.totalRevenue.toLocaleString("en-US", { maximumFractionDigits: 0 })}`);
  lines.push(`Total orders: ${d.totalOrders}`);
  lines.push(`Average conversion rate: ${d.avgConversionRate.toFixed(2)}%`);
  lines.push(`Top product by revenue: ${d.topProduct} ($${d.topProductRevenue.toLocaleString("en-US", { maximumFractionDigits: 0 })})`);
  if (d.lowInventoryRisk.length > 0) {
    lines.push(`Low inventory risk (≤${INVENTORY_RISK_THRESHOLD} units): ${d.lowInventoryRisk.join(", ")}`);
  }
  if (d.revenueByDate.length > 0) {
    lines.push("Revenue trend by date: " + d.revenueByDate.slice(0, 7).map((x) => `${x.date} $${x.value}`).join("; ") + (d.revenueByDate.length > 7 ? "..." : ""));
  }
  if (d.productPerformance.length > 0) {
    lines.push("Product performance (revenue): " + d.productPerformance.slice(0, 6).map((p) => `${p.name} $${p.revenue}`).join(", "));
  }
  return lines.join("\n");
}
