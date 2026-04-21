"use client";

import { PageContainer, PageHero, SiteHeader } from "@/components/layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { CaseStudiesPageContent } from "@/components/caseStudies/CaseStudiesPageContent";

export default function CaseStudiesPage() {
  const { locale } = useLanguage();
  return (
    <main className="min-h-screen page-bg text-gray-900">
      <PageContainer>
        <SiteHeader variant="back" />
        <PageHero
          title={locale === "zh" ? "案例与 Demo" : "Case Studies & Demos"}
          description={
            locale === "zh"
              ? "结构化展示业务问题、方案路径、技术栈与可见成果。"
              : "Structured case studies with problem framing, delivery path, and visible outcomes."
          }
        />
        <CaseStudiesPageContent />
      </PageContainer>
    </main>
  );
}
