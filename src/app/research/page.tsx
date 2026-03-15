"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { DemoPageLayout, AdvancedSettings, type AdvancedSettingsState } from "@/components/demo";
import { ResearchDemo } from "@/components/research/ResearchDemo";

export default function ResearchPage() {
  const { t } = useLanguage();
  const [advancedState, setAdvancedState] = useState<AdvancedSettingsState | null>(null);

  return (
    <DemoPageLayout
      title={t("research.title")}
      subtitle={t("research.subtitle")}
    >
      <ResearchDemo
        modelProvider={advancedState?.modelProvider ?? "auto"}
        outputLanguage={advancedState?.outputLanguage ?? "en"}
      />
      <AdvancedSettings state={advancedState ?? undefined} onChange={setAdvancedState} />
    </DemoPageLayout>
  );
}
