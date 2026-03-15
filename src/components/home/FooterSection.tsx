"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export function FooterSection() {
  const { t } = useLanguage();
  return (
    <section className="border-t border-gray-200 pt-16 pb-20 md:pt-20 md:pb-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-lg font-semibold text-gray-900">
          {t("footer.title")}
        </h2>
        <p className="mt-3 text-base text-gray-600 leading-relaxed">
          {t("footer.description")}
        </p>
      </div>
    </section>
  );
}
