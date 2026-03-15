import Link from "next/link";

export type DemoCardProps = {
  title: string;
  description: string;
  targetUser: string;
  ctaLabel: string;
  href: string;
};

export function DemoCard({
  title,
  description,
  targetUser,
  ctaLabel,
  href,
}: DemoCardProps) {
  return (
    <div className="card flex flex-col transition hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
        {targetUser}
      </p>
      <h2 className="card-title mt-3">{title}</h2>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
        {description}
      </p>
      <Link
        href={href}
        className="mt-5 inline-flex w-fit rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
