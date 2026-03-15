"use client";

import { DemoCard } from "@/components/ui";
import { SectionHeader } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { FLAGSHIP_DEMOS } from "./demos";

export function DemoGrid() {
  const { t } = useLanguage();
  return (
    <section id="demos" className="scroll-mt-8 pt-16 pb-20 md:pt-20 md:pb-24">
      <p className="mb-2 text-center text-sm font-medium text-gray-500">
        {t("home.supportMessage")}
      </p>
      <SectionHeader
        title={t("demos.sectionTitle")}
        description={t("demos.sectionDescription")}
      />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FLAGSHIP_DEMOS.map((demo) => (
          <DemoCard
            key={demo.id}
            title={t(demo.titleKey)}
            description={t(demo.descriptionKey)}
            ctaLabel={t(demo.ctaKey)}
            href={demo.href}
          />
        ))}
      </div>
    </section>
  );
}
