"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

type SiteHeaderProps = {
  variant?: "home" | "back";
};

export function SiteHeader({ variant = "home" }: SiteHeaderProps) {
  const { t, locale, setLocale } = useLanguage();

  if (variant === "back") {
    return (
      <header className="border-b border-gray-200 pb-6">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/demos"
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
    <header className="flex items-center justify-between border-b border-gray-200 pb-6">
      <Link
        href="/"
        className="text-base font-semibold text-gray-900 hover:text-gray-700"
      >
        {t("nav.brand")}
      </Link>
      <div className="flex items-center gap-4">
        <Link href="/demos" className="btn-secondary py-2.5 px-4">
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
    </header>
  );
}
