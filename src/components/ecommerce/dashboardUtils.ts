import type { OrderRow } from "./sampleOrders";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export type DashboardData = {
  totalRevenue: number;
  orderCount: number;
  aov: number;
  revenueByMonth: { month: string; value: number }[];
  topProducts: { name: string; value: number }[];
  categoryBreakdown: { name: string; value: number }[];
  uniqueCustomers: number;
  returningCustomerRate: number; // 0-100, % of orders from customers with >1 order
};

export function computeDashboard(orders: OrderRow[]): DashboardData {
  if (orders.length === 0) {
    return {
      totalRevenue: 0,
      orderCount: 0,
      aov: 0,
      revenueByMonth: [],
      topProducts: [],
      categoryBreakdown: [],
      uniqueCustomers: 0,
      returningCustomerRate: 0,
    };
  }

  const totalRevenue = orders.reduce((sum, o) => sum + o.revenue, 0);
  const orderCount = orders.length;
  const aov = orderCount > 0 ? totalRevenue / orderCount : 0;

  // Revenue by month (parse date, group by YYYY-MM, then map to month label)
  const byMonth = new Map<string, number>();
  for (const o of orders) {
    const d = o.date.slice(0, 7); // YYYY-MM
    byMonth.set(d, (byMonth.get(d) ?? 0) + o.revenue);
  }
  const sortedMonths = Array.from(byMonth.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  const revenueByMonth = sortedMonths.map(([ym, value]) => {
    const [y, m] = ym.split("-");
    const monthLabel = MONTHS[parseInt(m, 10) - 1] ?? ym;
    return { month: monthLabel, value };
  });

  // Top products by revenue
  const byProduct = new Map<string, number>();
  for (const o of orders) {
    byProduct.set(o.product, (byProduct.get(o.product) ?? 0) + o.revenue);
  }
  const topProducts = Array.from(byProduct.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  // Category breakdown
  const byCategory = new Map<string, number>();
  for (const o of orders) {
    byCategory.set(o.category, (byCategory.get(o.category) ?? 0) + o.revenue);
  }
  const categoryBreakdown = Array.from(byCategory.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Returning customers: count orders where customer appears more than once
  const customerOrderCount = new Map<string, number>();
  for (const o of orders) {
    customerOrderCount.set(o.customer, (customerOrderCount.get(o.customer) ?? 0) + 1);
  }
  const uniqueCustomers = customerOrderCount.size;
  const returningOrders = orders.filter((o) => (customerOrderCount.get(o.customer) ?? 0) > 1).length;
  const returningCustomerRate = orderCount > 0 ? (returningOrders / orderCount) * 100 : 0;

  return {
    totalRevenue,
    orderCount,
    aov,
    revenueByMonth,
    topProducts,
    categoryBreakdown,
    uniqueCustomers,
    returningCustomerRate,
  };
}

/** Build a text summary of the dataset for the AI chat context. */
export function buildDatasetSummary(orders: OrderRow[]): string {
  const d = computeDashboard(orders);
  const lines: string[] = [];

  lines.push(`Total revenue: $${d.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
  lines.push(`Order count: ${d.orderCount}`);
  lines.push(`Average order value: $${d.aov.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
  lines.push(`Unique customers: ${d.uniqueCustomers}`);
  lines.push(`Returning customer rate: ${d.returningCustomerRate.toFixed(1)}% (orders from customers with more than one order).`);

  if (d.revenueByMonth.length > 0) {
    lines.push("Revenue trend by month: " + d.revenueByMonth.map((m) => `${m.month} $${m.value.toFixed(0)}`).join(", "));
  }

  if (d.topProducts.length > 0) {
    lines.push("Top products by revenue: " + d.topProducts.slice(0, 5).map((p) => `${p.name} $${p.value.toFixed(0)}`).join(", "));
  }

  if (d.categoryBreakdown.length > 0) {
    lines.push("Revenue by category: " + d.categoryBreakdown.map((c) => `${c.name} $${c.value.toFixed(0)}`).join(", "));
  }

  const byCountry = new Map<string, number>();
  const byChannel = new Map<string, number>();
  for (const o of orders) {
    if (o.country) byCountry.set(o.country, (byCountry.get(o.country) ?? 0) + o.revenue);
    if (o.channel) byChannel.set(o.channel, (byChannel.get(o.channel) ?? 0) + o.revenue);
  }
  if (byCountry.size > 0) {
    lines.push("Revenue by country: " + Array.from(byCountry.entries()).map(([k, v]) => `${k} $${v.toFixed(0)}`).join(", "));
  }
  if (byChannel.size > 0) {
    lines.push("Revenue by channel: " + Array.from(byChannel.entries()).map(([k, v]) => `${k} $${v.toFixed(0)}`).join(", "));
  }

  return lines.join("\n");
}
