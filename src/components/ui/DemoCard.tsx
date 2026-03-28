import Link from "next/link";

export type DemoCardProps = {
  title: string;
  description: string;
  targetUser?: string;
  ctaLabel: string;
  href: string;
  className?: string;
};

export function DemoCard({
  title,
  description,
  targetUser,
  ctaLabel,
  href,
  className = "",
}: DemoCardProps) {
  return (
    <div
      className={`card flex flex-col transition-shadow hover:shadow-md ${className}`}
    >
      {targetUser && (
        <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
          {targetUser}
        </p>
      )}
      <h2 className={`text-lg font-medium text-gray-900 ${targetUser ? "mt-3" : ""}`}>
        {title}
      </h2>
      <p className="mt-3 flex-1 text-sm text-gray-600 leading-relaxed">
        {description}
      </p>
      <Link href={href} className="mt-6 w-fit btn-primary py-2.5 px-4 text-white">
        {ctaLabel}
      </Link>
    </div>
  );
}
