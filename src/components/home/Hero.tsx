"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

export function Hero() {
  const { locale } = useLanguage();
  const copy =
    locale === "zh"
      ? {
          title: "汪久量 | AI 应用工程师 / LLM Engineer / Agent Automation",
          subtitle:
            "把 AI 做成能上线、能复盘、能增长的业务系统。覆盖从 LLM/RAG/Agent 方案设计、原型验证到落地迭代。",
          ctaPrimary: "查看履历",
          ctaSecondary: "查看服务",
        }
      : {
          title: "Joseph Wang | AI Product Builder and LLM Engineer",
          subtitle:
            "I help teams turn AI ideas into deliverable systems across LLM, RAG, agent workflows, and data products.",
          ctaPrimary: "View Resume",
          ctaSecondary: "View Services",
        };
  return (
    <section className="pt-10 pb-24 sm:pb-28 md:pb-32">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl md:text-5xl md:leading-tight">
          {copy.title}
        </h1>
        <p className="mt-6 text-xl text-gray-600 leading-relaxed">
          {copy.subtitle}
        </p>
        <div className="mt-8 text-sm text-gray-500">
          joseph@josephjwang.com · +86 134 8223 9970 · Shanghai / Remote
        </div>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:gap-4">
          <Link href="/resume" className="btn-primary">
            {copy.ctaPrimary}
          </Link>
          <Link href="/services" className="btn-secondary">
            {copy.ctaSecondary}
          </Link>
        </div>
      </div>
    </section>
  );
}
