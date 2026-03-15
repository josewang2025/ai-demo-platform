import Link from "next/link";

const BRAND = "AI Solutions Lab";

type AppHeaderProps = {
  /** Right-side action: e.g. "View Dashboard" on home, "Back to Home" on dashboard */
  action?: { label: string; href: string };
  /** If true, brand links to home; otherwise plain text */
  brandLink?: boolean;
};

export function AppHeader({ action, brandLink = true }: AppHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-slate-200/90 pb-6">
      {brandLink ? (
        <Link
          href="/"
          className="text-[1.0625rem] font-semibold tracking-tight text-slate-900 hover:text-slate-700"
        >
          {BRAND}
        </Link>
      ) : (
        <span className="text-[1.0625rem] font-semibold tracking-tight text-slate-900">
          {BRAND}
        </span>
      )}
      {action && (
        <Link href={action.href} className="btn-secondary py-2.5 px-4">
          {action.label}
        </Link>
      )}
    </header>
  );
}
