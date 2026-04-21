"use client";

import { PageContainer, SiteHeader } from "@/components/layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { CaseStudiesPageContent } from "@/components/caseStudies/CaseStudiesPageContent";

export default function CaseStudiesPage() {
  const { locale } = useLanguage();
  return (
    <main className="min-h-screen page-bg text-gray-900">
      <PageContainer>
        <SiteHeader variant="back" />
        <header className="mt-10">
          <h1 className="text-3xl font-semibold text-gray-900">
            {locale === "zh" ? "案例与 Demo" : "Case Studies & Demos"}
          </h1>
          <p className="mt-3 max-w-3xl text-base text-gray-600 leading-relaxed">
            {locale === "zh"
              ? "结构化展示业务问题、方案路径、技术栈与可见成果。"
              : "Structured case studies with problem framing, delivery path, and visible outcomes."}
          </p>
        </header>
        <CaseStudiesPageContent />
      </PageContainer>
    </main>
  );
}
