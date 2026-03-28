type MetricCardProps = {
  label: string;
  value: string;
  trend?: string;
  className?: string;
};

export function MetricCard({
  label,
  value,
  trend,
  className = "",
}: MetricCardProps) {
  return (
    <div className={`card ${className}`}>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
      {trend && <p className="mt-1.5 text-sm font-medium text-green-600">{trend}</p>}
    </div>
  );
}
