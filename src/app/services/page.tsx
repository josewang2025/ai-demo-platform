"use client";

import { PageContainer, PageHero, SiteHeader } from "@/components/layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { ServicesPageContent } from "@/components/services/ServicesPageContent";

export default function ServicesPage() {
  const { locale } = useLanguage();
  return (
    <main className="min-h-screen page-bg text-gray-900">
      <PageContainer>
        <SiteHeader variant="back" />
        <PageHero
          title={locale === "zh" ? "AI 咨询与交付服务" : "AI Consulting & Delivery Services"}
          description={
            locale === "zh"
              ? "从 AI 原型到可运维系统，围绕业务目标交付可执行方案与复盘机制。"
              : "From AI prototype to production-ready systems, with business-outcome driven execution."
          }
        />
        <ServicesPageContent />
      </PageContainer>
    </main>
  );
}
