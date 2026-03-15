"use client";

import { SiteHeader, PageContainer } from "@/components/layout";
import { useLanguage } from "@/contexts/LanguageContext";

type DemoPageLayoutProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export function DemoPageLayout({ title, subtitle, children }: DemoPageLayoutProps) {
  return (
    <main className="min-h-screen page-bg text-gray-900">
      <PageContainer>
        <SiteHeader variant="back" />
        <header className="mt-10">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-base text-gray-600 leading-relaxed">
            {subtitle}
          </p>
        </header>
        <div className="mt-10 space-y-10">{children}</div>
      </PageContainer>
    </main>
  );
}
