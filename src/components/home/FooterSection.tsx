"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export function FooterSection() {
  const { locale } = useLanguage();
  return (
    <section className="border-t border-gray-200 pt-16 pb-20 md:pt-20 md:pb-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-lg font-semibold text-gray-900">
          {locale === "zh" ? "有明确业务目标，欢迎沟通" : "Have a clear business goal? Let's talk."}
        </h2>
        <p className="mt-3 text-base text-gray-600 leading-relaxed">
          {locale === "zh"
            ? "发送行业、阶段与期望时间线，我会在 1-2 个工作日内回复可行路径与下一步建议。"
            : "Send your industry, stage, and timeline. I will respond with fit and a practical next-step path in 1-2 business days."}
        </p>
        <a href="mailto:joseph@josephjwang.com" className="mt-6 inline-block btn-primary">
          {locale === "zh" ? "联系我" : "Contact Me"}
        </a>
      </div>
    </section>
  );
}
