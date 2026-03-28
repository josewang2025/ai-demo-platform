"use client";

/**
 * Shared lightweight chart components for dashboard views.
 * No external chart lib; SVG-based for consistency and bundle size.
 */

type DataPoint = { label: string; value: number };

export function RevenueTrendChart({
  data,
  valueLabel = "Revenue",
}: {
  data: DataPoint[];
  valueLabel?: string;
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
      const x = padding.left + (data.length === 1 ? 0 : (i / Math.max(data.length - 1, 1)) * innerW);
      const y = padding.top + innerH - (d.value / max) * innerH;
      return `${x},${y}`;
    })
    .join(" ");
  const labelStep = data.length <= 8 ? 1 : Math.ceil(data.length / 6);
  return (
    <div className="mt-4">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-48 w-full"
        preserveAspectRatio="xMidYMid meet"
        aria-label={valueLabel}
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
        {data.filter((_, i) => i % labelStep === 0).map((d, i) => (
          <span key={`${d.label}-${i}`}>{d.label}</span>
        ))}
      </div>
    </div>
  );
}

export function HorizontalBarChart({
  data,
  maxItems = 8,
  valueFormat = (v: number) => `$${v.toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
}: {
  data: DataPoint[];
  maxItems?: number;
  valueFormat?: (v: number) => string;
}) {
  const slice = data.slice(0, maxItems);
  if (slice.length === 0) return null;
  const maxVal = Math.max(...slice.map((d) => d.value), 1);
  return (
    <div className="mt-4 space-y-3">
      {slice.map((d) => (
        <div key={d.label} className="flex items-center gap-3">
          <span className="w-28 shrink-0 truncate text-sm font-medium text-gray-700" title={d.label}>
            {d.label}
          </span>
          <div className="min-w-0 flex-1">
            <div className="h-7 overflow-hidden rounded-md bg-gray-100">
              <div
                className="h-full rounded-md bg-sky-500 transition-all"
                style={{ width: `${(d.value / maxVal) * 100}%` }}
              />
            </div>
          </div>
          <span className="w-20 shrink-0 text-right text-sm font-medium text-gray-600">
            {valueFormat(d.value)}
          </span>
        </div>
      ))}
    </div>
  );
}
