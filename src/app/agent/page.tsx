"use client";

import { SiteHeader, PageContainer } from "@/components/layout";
import { AgentChat } from "@/components/agent/AgentChat";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AgentPage() {
  const { t } = useLanguage();
  return (
    <main className="min-h-screen page-bg text-gray-900">
      <PageContainer size="narrow">
        <SiteHeader variant="back" />
        <header className="mt-10">
          <h1 className="text-3xl font-semibold text-gray-900">
            {t("agent.title")}
          </h1>
          <p className="mt-3 max-w-xl text-base text-gray-600 leading-relaxed">
            {t("agent.subtitle")}
          </p>
        </header>
        <div className="mt-10">
          <AgentChat />
        </div>
      </PageContainer>
    </main>
  );
}
