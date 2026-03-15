import { SiteHeader, PageContainer } from "@/components/layout";
import { MetricCard } from "@/components/ui";

const KPIS = [
  { label: "Revenue", value: "$124,580", trend: "+12.4% vs last period" },
  { label: "Orders", value: "2,847", trend: "+8.2% vs last period" },
  { label: "Average Order Value", value: "$43.75", trend: "+3.1% vs last period" },
  { label: "Conversion Rate", value: "2.84%", trend: "+0.2% vs last period" },
];

const REVENUE_TREND = [
  { month: "Jan", value: 98 },
  { month: "Feb", value: 102 },
  { month: "Mar", value: 105 },
  { month: "Apr", value: 108 },
  { month: "May", value: 112 },
  { month: "Jun", value: 115 },
  { month: "Jul", value: 118 },
  { month: "Aug", value: 120 },
  { month: "Sep", value: 122 },
  { month: "Oct", value: 125 },
  { month: "Nov", value: 128 },
  { month: "Dec", value: 132 },
];

const TOP_PRODUCTS = [
  { name: "Wireless Earbuds Pro", value: 28400 },
  { name: "Leather Backpack", value: 22100 },
  { name: "Smart Watch S2", value: 19800 },
  { name: "Desk Lamp LED", value: 16500 },
  { name: "USB-C Hub", value: 14200 },
];

const maxRevenue = Math.max(...REVENUE_TREND.map((d) => d.value));
const maxProduct = Math.max(...TOP_PRODUCTS.map((d) => d.value));

export default function DashboardPage() {
  return (
    <main className="min-h-screen page-bg text-gray-900">
      <PageContainer>
        <SiteHeader variant="back" />
        <header className="mt-10">
          <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-3 text-base text-gray-600 leading-relaxed">
            Key metrics and trends at a glance. Use this view to track performance and spot opportunities.
          </p>
        </header>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {KPIS.map((kpi) => (
            <MetricCard
              key={kpi.label}
              label={kpi.label}
              value={kpi.value}
              trend={kpi.trend}
            />
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-1">
          <div className="card">
            <h2 className="text-lg font-medium text-gray-900">Revenue Trend</h2>
            <p className="mt-1 text-sm text-gray-500">Last 12 months (indexed)</p>
            <div className="mt-6 h-64 w-full">
              <svg
                viewBox="0 0 400 120"
                className="h-full w-full"
                preserveAspectRatio="none"
              >
                <polyline
                  fill="none"
                  stroke="rgb(14, 165, 233)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={REVENUE_TREND.map((d, i) => {
                    const x = (i / (REVENUE_TREND.length - 1)) * 380 + 10;
                    const y = 110 - (d.value / maxRevenue) * 90;
                    return `${x},${y}`;
                  }).join(" ")}
                />
              </svg>
            </div>
            <div className="mt-2 flex justify-between text-xs text-gray-400">
              {REVENUE_TREND.map((d) => (
                <span key={d.month}>{d.month}</span>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-medium text-gray-900">Top Products</h2>
            <p className="mt-1 text-sm text-gray-500">Revenue by product</p>
            <div className="mt-6 space-y-4">
              {TOP_PRODUCTS.map((p) => (
                <div key={p.name} className="flex items-center gap-4">
                  <span className="w-40 shrink-0 truncate text-sm font-medium text-gray-700 sm:w-48">
                    {p.name}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="h-8 overflow-hidden rounded-lg bg-gray-100">
                      <div
                        className="h-full rounded-lg bg-sky-500"
                        style={{ width: `${(p.value / maxProduct) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="w-16 shrink-0 text-right text-sm font-medium text-gray-600">
                    ${(p.value / 1000).toFixed(1)}k
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageContainer>
    </main>
  );
}
