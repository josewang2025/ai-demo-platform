"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { DemoPageLayout, AdvancedSettings, type AdvancedSettingsState } from "@/components/demo";
import { EcommerceDemo } from "@/components/ecommerce/EcommerceDemo";

export default function EcommercePage() {
  const { t } = useLanguage();
  const [advancedState, setAdvancedState] = useState<AdvancedSettingsState | null>(null);

  return (
    <DemoPageLayout
      title={t("ecommerce.title")}
      subtitle={t("ecommerce.subtitle")}
    >
      <EcommerceDemo
        modelProvider={advancedState?.modelProvider ?? "auto"}
        outputLanguage={advancedState?.outputLanguage ?? "en"}
      />
      <AdvancedSettings state={advancedState ?? undefined} onChange={setAdvancedState} />
    </DemoPageLayout>
  );
}
