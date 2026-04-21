"use client";

import { PageContainer, PageHero, SiteHeader } from "@/components/layout";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AboutPage() {
  const { locale } = useLanguage();
  const zh = locale === "zh";

  return (
    <main className="min-h-screen page-bg text-gray-900">
      <PageContainer>
        <SiteHeader variant="back" />
        <PageHero
          title={zh ? "关于我" : "About"}
          description={
            zh
              ? "我是 Joseph Wang，长期聚焦 AI 产品化、增长数据科学与跨中英市场协作，帮助团队把复杂能力转化为清晰、可交付的产品价值。"
              : "I focus on AI product delivery, growth analytics, and cross-market collaboration to turn complex capabilities into practical outcomes."
          }
        />
      </PageContainer>
    </main>
  );
}
