"use client";

import { SectionHeader } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";

const STEP_KEYS = [
  { titleKey: "howItWorks.step1Title", descKey: "howItWorks.step1Desc" },
  { titleKey: "howItWorks.step2Title", descKey: "howItWorks.step2Desc" },
  { titleKey: "howItWorks.step3Title", descKey: "howItWorks.step3Desc" },
] as const;

function StepIcon({ step }: { step: number }) {
  if (step === 1) {
    return (
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600" aria-hidden>
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      </span>
    );
  }
  if (step === 2) {
    return (
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600" aria-hidden>
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </span>
    );
  }
  return (
    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600" aria-hidden>
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    </span>
  );
}

export function WorkflowSection() {
  const { t } = useLanguage();
  return (
    <section id="how-it-works" className="scroll-mt-8 pt-16 pb-20 md:pt-20 md:pb-24">
      <SectionHeader
        title={t("howItWorks.title")}
        description={t("howItWorks.description")}
      />
      <div className="mt-12 grid gap-8 sm:grid-cols-3">
        {STEP_KEYS.map((step, i) => (
          <div key={step.titleKey} className="card flex flex-col items-center text-center">
            <StepIcon step={i + 1} />
            <h3 className="mt-4 text-base font-medium text-gray-900">{t(step.titleKey)}</h3>
            <p className="mt-2 text-sm text-gray-500 leading-relaxed">{t(step.descKey)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
