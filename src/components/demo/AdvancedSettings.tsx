"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export type ResponseMode = "fast" | "deep" | "research";
export type ModelProvider = "auto" | "openai" | "anthropic" | "gemini";
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

type AdvancedSettingsProps = {
  state?: Partial<AdvancedSettingsState>;
  onChange?: (state: AdvancedSettingsState) => void;
};

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

  return (
    <section className="card">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-left"
        aria-expanded={open}
      >
        <h2 className="text-lg font-medium text-gray-900">{t("advanced.title")}</h2>
        <span className="text-gray-500" aria-hidden>
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <div className="mt-6 space-y-6 border-t border-gray-200 pt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">{t("advanced.responseMode")}</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {(["fast", "deep", "research"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => update({ responseMode: mode })}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    state.responseMode === mode
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {mode === "fast" && t("advanced.responseModeFast")}
                  {mode === "deep" && t("advanced.responseModeDeep")}
                  {mode === "research" && t("advanced.responseModeResearch")}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{t("advanced.modelProvider")}</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {(["auto", "openai", "anthropic", "gemini"] as const).map((provider) => (
                <button
                  key={provider}
                  type="button"
                  onClick={() => update({ modelProvider: provider })}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    state.modelProvider === provider
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {provider === "auto" && t("advanced.modelAuto")}
                  {provider === "openai" && t("advanced.modelOpenAI")}
                  {provider === "anthropic" && t("advanced.modelClaude")}
                  {provider === "gemini" && t("advanced.modelGemini")}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{t("advanced.outputLanguage")}</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {(["en", "zh"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => update({ outputLanguage: lang })}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    state.outputLanguage === lang
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {lang === "en" ? t("advanced.outputEn") : t("advanced.outputZh")}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{t("advanced.reportStyle")}</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {(["concise", "executive", "detailed"] as const).map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => update({ reportStyle: style })}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    state.reportStyle === style
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {style === "concise" && t("advanced.reportConcise")}
                  {style === "executive" && t("advanced.reportExecutive")}
                  {style === "detailed" && t("advanced.reportDetailed")}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
