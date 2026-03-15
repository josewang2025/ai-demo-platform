/**
 * Data Analyst demo: aggregated business data by date, region, segment.
 * Schema: date, region, segment, revenue, orders, profit, customer_count
 */

export type AnalystRow = {
  date: string;
  region: string;
  segment: string;
  revenue: number;
  orders: number;
  profit: number;
  customer_count: number;
};

const REGIONS = ["North America", "EMEA", "APAC"];
const SEGMENTS = ["Enterprise", "SMB", "Consumer"];

function buildAnalystRows(): AnalystRow[] {
  const rows: AnalystRow[] = [];
  const start = new Date("2024-01-01");
  for (let d = 0; d < 90; d++) {
    const date = new Date(start);
    date.setDate(date.getDate() + d);
    const dateStr = date.toISOString().slice(0, 10);
    const monthProgress = d / 90;

    REGIONS.forEach((region, rIdx) => {
      SEGMENTS.forEach((segment, sIdx) => {
        const baseRevenue = (rIdx + 1) * 8000 + (sIdx + 1) * 2000;
        const trend = 1 + monthProgress * 0.15 + (d % 7) * 0.02;
        const revenue = Math.round(baseRevenue * trend * (0.9 + (d + rIdx + sIdx) % 5 * 0.05));
        const orders = Math.max(5, Math.round(revenue / (80 + (rIdx + sIdx) * 20)));
        const profit = Math.round(revenue * (0.12 + (sIdx * 0.03) - (rIdx * 0.01)));
        const customer_count = Math.max(orders - 2, Math.round(orders * (0.6 + (d % 10) / 50)));

        rows.push({
          date: dateStr,
          region,
          segment,
          revenue,
          orders,
          profit,
          customer_count: customer_count,
        });
      });
    });
  }
  return rows.sort((a, b) => a.date.localeCompare(b.date));
}

export const SAMPLE_ANALYST_DATA: AnalystRow[] = buildAnalystRows();
