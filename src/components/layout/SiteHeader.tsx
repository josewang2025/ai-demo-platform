"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

type SiteHeaderProps = {
  variant?: "home" | "back";
};

export function SiteHeader({ variant = "home" }: SiteHeaderProps) {
  const { t, locale, setLocale } = useLanguage();
  const menuItems =
    locale === "zh"
      ? [
          { href: "/resume", label: "履历" },
          { href: "/services", label: "服务" },
          { href: "/case-studies", label: "案例" },
          { href: "/dashboard", label: "总览" },
          { href: "/analyst", label: "Demo" },
          { href: "/contact", label: "联系" },
        ]
      : [
          { href: "/resume", label: "Resume" },
          { href: "/services", label: "Services" },
          { href: "/case-studies", label: "Case Studies" },
          { href: "/dashboard", label: "Overview" },
          { href: "/analyst", label: "Demos" },
          { href: "/contact", label: "Contact" },
        ];

  if (variant === "back") {
    return (
      <header className="border-b border-gray-200 pb-6">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <span aria-hidden>←</span>
            {t("nav.backTo")}
          </Link>
          <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-0.5 text-sm">
            <button
              type="button"
              onClick={() => setLocale("en")}
              className={`rounded-md px-2.5 py-1 font-medium ${locale === "en" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
              aria-pressed={locale === "en"}
            >
              {t("nav.langEn")}
            </button>
            <button
              type="button"
              onClick={() => setLocale("zh")}
              className={`rounded-md px-2.5 py-1 font-medium ${locale === "zh" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
              aria-pressed={locale === "zh"}
            >
              {t("nav.langZh")}
            </button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b border-gray-200 pb-6">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/"
          className="text-base font-semibold text-gray-900 hover:text-gray-700"
        >
          {t("nav.brand")}
        </Link>
        <div className="flex items-center gap-4">
          <Link href="#demos" className="btn-secondary py-2.5 px-4">
            {t("nav.exploreDemos")}
          </Link>
          <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-0.5 text-sm">
            <button
              type="button"
              onClick={() => setLocale("en")}
              className={`rounded-md px-2.5 py-1 font-medium ${locale === "en" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
              aria-pressed={locale === "en"}
            >
              {t("nav.langEn")}
            </button>
            <button
              type="button"
              onClick={() => setLocale("zh")}
              className={`rounded-md px-2.5 py-1 font-medium ${locale === "zh" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
              aria-pressed={locale === "zh"}
            >
              {t("nav.langZh")}
            </button>
          </div>
        </div>
      </div>
      <nav className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href} className="hover:text-gray-900">
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
