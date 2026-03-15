"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

export function Hero() {
  const { t } = useLanguage();
  return (
    <section className="pt-10 pb-24 sm:pb-28 md:pb-32">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl md:text-5xl md:leading-tight">
          {t("hero.title")}
        </h1>
        <p className="mt-6 text-xl text-gray-600 leading-relaxed">
          {t("hero.subtitle")}
        </p>
        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:gap-4">
          <Link href="#demos" className="btn-primary">
            {t("hero.ctaExplore")}
          </Link>
          <Link href="#how-it-works" className="btn-secondary">
            {t("hero.ctaHowItWorks")}
          </Link>
        </div>
      </div>
    </section>
  );
}
