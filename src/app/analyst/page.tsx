"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { DemoPageLayout, AdvancedSettings, type AdvancedSettingsState } from "@/components/demo";
import { AnalystDemo } from "@/components/analyst/AnalystDemo";

const DEFAULT_ADVANCED: AdvancedSettingsState = {
  responseMode: "fast",
  modelProvider: "auto",
  outputLanguage: "en",
  reportStyle: "concise",
};

export default function AnalystPage() {
  const { t, locale } = useLanguage();
  const [advancedState, setAdvancedState] = useState<AdvancedSettingsState | null>(null);
  const defaultState: AdvancedSettingsState = { ...DEFAULT_ADVANCED, outputLanguage: locale };

  return (
    <DemoPageLayout
      title={t("analyst.title")}
      subtitle={t("analyst.subtitle")}
    >
      <AnalystDemo
        modelProvider={advancedState?.modelProvider ?? "auto"}
        outputLanguage={advancedState?.outputLanguage ?? locale}
        responseMode={advancedState?.responseMode ?? "fast"}
        reportStyle={advancedState?.reportStyle ?? "concise"}
      />
      <AdvancedSettings state={advancedState ?? defaultState} onChange={setAdvancedState} />
    </DemoPageLayout>
  );
}
