/**
 * Sample ecommerce orders for the demo. Schema matches CSV template:
 * date, order_id, product, category, price, quantity, revenue, customer, country, channel
 */
export type OrderRow = {
  date: string;
  order_id: string;
  product: string;
  category: string;
  price: number;
  quantity: number;
  revenue: number;
  customer: string;
  country: string;
  channel: string;
};

const PRODUCTS: [string, string, number][] = [
  ["Smart Watch S2", "Electronics", 199],
  ["Leather Backpack", "Accessories", 129],
  ["Running Shoes", "Sportswear", 89.99],
  ["Wireless Earbuds", "Electronics", 79.99],
  ["Fitness Tracker", "Electronics", 59.99],
];

const COUNTRIES = ["USA", "UK", "Canada", "Germany", "Australia"];
const CHANNELS = ["Google Ads", "Facebook", "Instagram", "Organic", "Email"];

function buildSampleRows(): OrderRow[] {
  const rows: OrderRow[] = [];
  let orderId = 1001;
  const start = new Date("2024-01-01");
  for (let i = 0; i < 110; i++) {
    const [product, category, price] = PRODUCTS[i % PRODUCTS.length];
    const quantity = i % 6 === 0 ? 2 : 1;
    const revenue = Math.round(price * quantity * 100) / 100;
    const d = new Date(start);
    d.setDate(d.getDate() + Math.floor(i * 3.2));
    const date = d.toISOString().slice(0, 10);
    const customer = `C${String((i % 45) + 1).padStart(3, "0")}`;
    const country = COUNTRIES[i % COUNTRIES.length];
    const channel = CHANNELS[i % CHANNELS.length];
    rows.push({
      date,
      order_id: String(orderId++),
      product,
      category,
      price,
      quantity,
      revenue,
      customer,
      country,
      channel,
    });
  }
  return rows.sort((a, b) => a.date.localeCompare(b.date));
}

export const SAMPLE_ORDERS: OrderRow[] = buildSampleRows();
