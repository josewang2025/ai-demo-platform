"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { DemoPageLayout, AdvancedSettings, type AdvancedSettingsState } from "@/components/demo";
import { EcommerceDemo } from "@/components/ecommerce/EcommerceDemo";

const DEFAULT_ADVANCED: AdvancedSettingsState = {
  responseMode: "fast",
  modelProvider: "auto",
  outputLanguage: "en",
  reportStyle: "concise",
};

export default function EcommercePage() {
  const { t, locale } = useLanguage();
  const [advancedState, setAdvancedState] = useState<AdvancedSettingsState | null>(null);
  const defaultState: AdvancedSettingsState = { ...DEFAULT_ADVANCED, outputLanguage: locale };

  return (
    <DemoPageLayout
      title={t("ecommerce.title")}
      subtitle={t("ecommerce.subtitle")}
    >
      <EcommerceDemo
        modelProvider={advancedState?.modelProvider ?? "auto"}
        outputLanguage={advancedState?.outputLanguage ?? locale}
        responseMode={advancedState?.responseMode ?? "fast"}
        reportStyle={advancedState?.reportStyle ?? "concise"}
      />
      <AdvancedSettings state={advancedState ?? defaultState} onChange={setAdvancedState} />
    </DemoPageLayout>
  );
}
