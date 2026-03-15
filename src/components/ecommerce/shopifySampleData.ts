/**
 * Shopify-style aggregated store data for the AI Ecommerce Analyst demo.
 * Schema: date, product_name, category, orders, units_sold, revenue, ad_spend, conversion_rate, inventory
 */

export type ShopifyRow = {
  date: string;
  product_name: string;
  category: string;
  orders: number;
  units_sold: number;
  revenue: number;
  ad_spend: number;
  conversion_rate: number;
  inventory: number;
};

const PRODUCTS: { name: string; category: string }[] = [
  { name: "Wireless Earbuds", category: "Electronics" },
  { name: "Phone Case", category: "Accessories" },
  { name: "Portable Charger", category: "Electronics" },
  { name: "Desk Lamp", category: "Home" },
  { name: "Water Bottle", category: "Lifestyle" },
  { name: "Laptop Stand", category: "Office" },
];

function generateShopifyRows(): ShopifyRow[] {
  const rows: ShopifyRow[] = [];
  const start = new Date("2025-01-01");
  // 14 days of data, 6 products = 84 rows. Patterns: Wireless Earbuds top performer, Desk Lamp underperforming, Water Bottle low inventory risk.
  for (let d = 0; d < 14; d++) {
    const date = new Date(start);
    date.setDate(date.getDate() + d);
    const dateStr = date.toISOString().slice(0, 10);
    const dayIndex = d;

    PRODUCTS.forEach((p, pIdx) => {
      // Base revenue and orders by product (Wireless Earbuds highest, Desk Lamp lowest)
      const baseRevenue = pIdx === 0 ? 4200 : pIdx === 1 ? 1800 : pIdx === 2 ? 2400 : pIdx === 3 ? 600 : pIdx === 4 ? 1500 : 1200;
      const trend = 1 + (dayIndex * 0.015); // Slight upward trend
      const noise = 0.9 + ((dayIndex + pIdx * 7) % 11) * 0.02; // Deterministic variance
      const revenue = Math.round(baseRevenue * trend * noise);
      const orders = Math.max(1, Math.round(revenue / (pIdx === 0 ? 89 : pIdx === 1 ? 29 : pIdx === 2 ? 45 : pIdx === 3 ? 35 : pIdx === 4 ? 22 : 48)));
      const units_sold = orders * (pIdx === 0 ? 1.2 : pIdx === 4 ? 2 : 1);
      const ad_spend = pIdx === 0 ? Math.round(revenue * 0.12) : pIdx === 3 ? Math.round(revenue * 0.25) : Math.round(revenue * 0.08);
      const conversion_rate = pIdx === 0 ? 3.8 : pIdx === 3 ? 1.2 : 2.2 + ((dayIndex + pIdx) % 5) * 0.15;
      // Inventory: Water Bottle low (risk), others moderate
      const inventory = pIdx === 4 ? 12 + d : pIdx === 3 ? 45 + d * 2 : 80 + d * 3;

      rows.push({
        date: dateStr,
        product_name: p.name,
        category: p.category,
        orders,
        units_sold: Math.round(units_sold),
        revenue,
        ad_spend,
        conversion_rate: Math.round(conversion_rate * 100) / 100,
        inventory,
      });
    });
  }
  return rows.sort((a, b) => a.date.localeCompare(b.date));
}

export const SHOPIFY_SAMPLE_DATA: ShopifyRow[] = generateShopifyRows();
