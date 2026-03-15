"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { DemoPageLayout, AdvancedSettings, type AdvancedSettingsState } from "@/components/demo";
import { AnalystDemo } from "@/components/analyst/AnalystDemo";

export default function AnalystPage() {
  const { t } = useLanguage();
  const [advancedState, setAdvancedState] = useState<AdvancedSettingsState | null>(null);

  return (
    <DemoPageLayout
      title={t("analyst.title")}
      subtitle={t("analyst.subtitle")}
    >
      <AnalystDemo
        modelProvider={advancedState?.modelProvider ?? "auto"}
        outputLanguage={advancedState?.outputLanguage ?? "en"}
      />
      <AdvancedSettings state={advancedState ?? undefined} onChange={setAdvancedState} />
    </DemoPageLayout>
  );
}
