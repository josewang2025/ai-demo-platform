"use client";

type Action = {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
  external?: boolean;
  download?: boolean;
};

type PageHeroProps = {
  title: string;
  description: string;
  metaLine?: string;
  actions?: Action[];
};

export function PageHero({ title, description, metaLine, actions = [] }: PageHeroProps) {
  return (
    <header className="mt-10">
      <h1 className="text-3xl font-semibold text-gray-900">{title}</h1>
      <p className="mt-3 max-w-3xl text-base leading-relaxed text-gray-600">{description}</p>
      {metaLine && <p className="mt-2 text-sm text-gray-500">{metaLine}</p>}
      {actions.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-3">
          {actions.map((action) => {
            const className =
              action.variant === "secondary" ? "btn-secondary py-2.5 px-4" : "btn-primary py-2.5 px-4";
            return (
              <a
                key={`${action.label}-${action.href}`}
                className={className}
                href={action.href}
                download={action.download}
                target={action.external ? "_blank" : undefined}
                rel={action.external ? "noreferrer" : undefined}
              >
                {action.label}
              </a>
            );
          })}
        </div>
      )}
    </header>
  );
}
