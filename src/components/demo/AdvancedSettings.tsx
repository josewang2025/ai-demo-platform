"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export type ResponseMode = "fast" | "deep" | "research";
export type ModelProvider = "auto" | "openai" | "anthropic" | "gemini" | "qwen" | "deepseek";
export type OutputLanguage = "en" | "zh";
export type ReportStyle = "concise" | "executive" | "detailed";

export type AdvancedSettingsState = {
  responseMode: ResponseMode;
  modelProvider: ModelProvider;
  outputLanguage: OutputLanguage;
  reportStyle: ReportStyle;
};

const DEFAULT_STATE: AdvancedSettingsState = {
  responseMode: "fast",
  modelProvider: "auto",
  outputLanguage: "en",
  reportStyle: "concise",
};

/**
 * Map UI provider selection to API-supported provider.
 * Passes through qwen and deepseek; backend router handles availability and fallback.
 */
export function getResolvedProviderForApi(
  provider: ModelProvider
): "auto" | "openai" | "anthropic" | "gemini" | "qwen" | "deepseek" {
  return provider;
}

const RESPONSE_MODES: ResponseMode[] = ["fast", "deep", "research"];
const MODEL_PROVIDERS: ModelProvider[] = [
  "auto",
  "openai",
  "anthropic",
  "gemini",
  "qwen",
  "deepseek",
];
const OUTPUT_LANGUAGES: OutputLanguage[] = ["en", "zh"];
const REPORT_STYLES: ReportStyle[] = ["concise", "executive", "detailed"];

type AdvancedSettingsProps = {
  state?: Partial<AdvancedSettingsState>;
  onChange?: (state: AdvancedSettingsState) => void;
};

function SettingSection({
  title,
  help,
  children,
}: {
  title: string;
  help?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        {help && <p className="mt-0.5 text-xs text-gray-500">{help}</p>}
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function OptionPill<T extends string>({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
        selected
          ? "border-gray-900 bg-gray-900 text-white shadow-sm"
          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  );
}

export function AdvancedSettings({ state: controlledState, onChange }: AdvancedSettingsProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [internalState, setInternalState] = useState<AdvancedSettingsState>(DEFAULT_STATE);
  const state = { ...DEFAULT_STATE, ...internalState, ...controlledState };

  const update = (patch: Partial<AdvancedSettingsState>) => {
    const next = { ...state, ...patch };
    setInternalState(next);
    onChange?.(next);
  };

  const getProviderLabel = (p: ModelProvider) => {
    switch (p) {
      case "auto":
        return t("advanced.modelAuto");
      case "openai":
        return t("advanced.modelOpenAI");
      case "anthropic":
        return t("advanced.modelClaude");
      case "gemini":
        return t("advanced.modelGemini");
      case "qwen":
        return t("advanced.modelQwen");
      case "deepseek":
        return t("advanced.modelDeepSeek");
      default:
        return p;
    }
  };

  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-gray-50/50"
        aria-expanded={open}
      >
        <h2 className="text-lg font-semibold text-gray-900">
          {t("advanced.collapseLabel")}
        </h2>
        <span
          className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      {open && (
        <div className="border-t border-gray-100 px-6 pb-6 pt-5">
          <div className="space-y-8">
            <SettingSection
              title={t("advanced.responseMode")}
              help={t("advanced.responseModeHelp")}
            >
              {RESPONSE_MODES.map((mode) => (
                <OptionPill
                  key={mode}
                  selected={state.responseMode === mode}
                  onClick={() => update({ responseMode: mode })}
                >
                  {mode === "fast" && t("advanced.responseModeFast")}
                  {mode === "deep" && t("advanced.responseModeDeep")}
                  {mode === "research" && t("advanced.responseModeResearch")}
                </OptionPill>
              ))}
            </SettingSection>

            <SettingSection
              title={t("advanced.modelProvider")}
              help={t("advanced.modelProviderHelp")}
            >
              {MODEL_PROVIDERS.map((provider) => (
                <OptionPill
                  key={provider}
                  selected={state.modelProvider === provider}
                  onClick={() => update({ modelProvider: provider })}
                >
                  {getProviderLabel(provider)}
                </OptionPill>
              ))}
            </SettingSection>

            <SettingSection
              title={t("advanced.outputLanguage")}
              help={t("advanced.outputLanguageHelp")}
            >
              {OUTPUT_LANGUAGES.map((lang) => (
                <OptionPill
                  key={lang}
                  selected={state.outputLanguage === lang}
                  onClick={() => update({ outputLanguage: lang })}
                >
                  {lang === "en" ? t("advanced.outputEn") : t("advanced.outputZh")}
                </OptionPill>
              ))}
            </SettingSection>

            <SettingSection
              title={t("advanced.reportStyle")}
              help={t("advanced.reportStyleHelp")}
            >
              {REPORT_STYLES.map((style) => (
                <OptionPill
                  key={style}
                  selected={state.reportStyle === style}
                  onClick={() => update({ reportStyle: style })}
                >
                  {style === "concise" && t("advanced.reportConcise")}
                  {style === "executive" && t("advanced.reportExecutive")}
                  {style === "detailed" && t("advanced.reportDetailed")}
                </OptionPill>
              ))}
            </SettingSection>
          </div>
        </div>
      )}
    </section>
  );
}
