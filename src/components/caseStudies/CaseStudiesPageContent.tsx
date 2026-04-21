"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

const CASES = [
  {
    id: "analyst",
    demo: "/analyst",
    github: "https://github.com/",
    zh: {
      title: "AI Data Analyst",
      problem: "经营数据分散，汇报成本高，缺少可执行建议。",
      solution: "通过自动 KPI 快照、信号检测与报告结构化输出，提升复盘效率。",
      stack: "Next.js · TypeScript · Multi-model API",
    },
    en: {
      title: "AI Data Analyst",
      problem: "Business metrics were fragmented and hard to summarize quickly.",
      solution: "Delivered KPI snapshots, signal detection, and structured briefings.",
      stack: "Next.js · TypeScript · Multi-model API",
    },
  },
  {
    id: "ecommerce",
    demo: "/ecommerce",
    github: "https://github.com/",
    zh: {
      title: "AI Ecommerce Analyst",
      problem: "店铺与商品信号难以快速转化为增长动作。",
      solution: "构建收入趋势、商品表现和风险提示的顾问式分析界面。",
      stack: "Dashboard Utils · Prompt Orchestration",
    },
    en: {
      title: "AI Ecommerce Analyst",
      problem: "Store and SKU signals were difficult to convert into actions.",
      solution: "Built consultant-style analysis with trend, risk, and recommendation outputs.",
      stack: "Dashboard Utils · Prompt Orchestration",
    },
  },
  {
    id: "research",
    demo: "/research",
    github: "https://github.com/",
    zh: {
      title: "AI Research Assistant",
      problem: "复杂主题研究缺少稳定结构，输出不可复用。",
      solution: "支持结构化研究流程与章节化结果，便于汇报与决策。",
      stack: "Structured Prompting · Result Parsing",
    },
    en: {
      title: "AI Research Assistant",
      problem: "Complex topics lacked reusable and structured output.",
      solution: "Implemented guided inputs with section-based report rendering.",
      stack: "Structured Prompting · Result Parsing",
    },
  },
];

export function CaseStudiesPageContent() {
  const { locale } = useLanguage();
  const lang = locale === "zh" ? "zh" : "en";
  return (
    <div className="mt-10 space-y-8">
      {CASES.map((item) => (
        <article key={item.id} className="card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-gray-900">{item[lang].title}</h2>
            <div className="flex flex-wrap gap-2">
              <Link href={item.demo} className="btn-secondary py-2 px-3 text-sm">
                {lang === "zh" ? "在线体验" : "Live Demo"}
              </Link>
              <a href={item.github} target="_blank" rel="noreferrer" className="btn-secondary py-2 px-3 text-sm">
                GitHub
              </a>
            </div>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                {lang === "zh" ? "问题" : "Problem"}
              </p>
              <p className="mt-2 text-sm text-gray-700">{item[lang].problem}</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                {lang === "zh" ? "方案" : "Solution"}
              </p>
              <p className="mt-2 text-sm text-gray-700">{item[lang].solution}</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Stack</p>
              <p className="mt-2 text-sm text-gray-700">{item[lang].stack}</p>
            </div>
          </div>
        </article>
      ))}

      <section className="card">
        <h3 className="text-base font-semibold text-gray-900">
          {lang === "zh" ? "持续更新计划" : "Upcoming additions"}
        </h3>
        <ul className="mt-3 list-disc space-y-1.5 pl-4 text-sm text-gray-700">
          <li>{lang === "zh" ? "AI Agent Workflow 编排场景" : "AI agent workflow orchestration demos"}</li>
          <li>{lang === "zh" ? "企业知识库问答与审核链路" : "Enterprise knowledge assistant and review chains"}</li>
          <li>{lang === "zh" ? "内容运营 chatbot 与自动复盘面板" : "Content chatbot and automated review dashboards"}</li>
        </ul>
      </section>

      <section className="card">
        <h3 className="text-base font-semibold text-gray-900">
          {lang === "zh" ? "Open-source Notes" : "Open-source Notes"}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          {lang === "zh"
            ? "我会持续把可复用能力沉淀为开源片段与案例，包括提示模板、workflow 编排、以及数据分析组件。"
            : "I keep extracting reusable patterns into open-source snippets, including prompts, workflow orchestration, and analytics components."}
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <article className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              {lang === "zh" ? "当前聚焦" : "Current Focus"}
            </p>
            <ul className="mt-2 list-disc space-y-1.5 pl-4 text-sm text-gray-700">
              <li>{lang === "zh" ? "AI Agent workflow 编排模板" : "AI agent workflow orchestration templates"}</li>
              <li>{lang === "zh" ? "多模型路由与容错实践" : "Multi-model routing and failover patterns"}</li>
            </ul>
          </article>
          <article className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              {lang === "zh" ? "下一步计划" : "Next Up"}
            </p>
            <ul className="mt-2 list-disc space-y-1.5 pl-4 text-sm text-gray-700">
              <li>{lang === "zh" ? "可复制的 RAG 评估脚手架" : "Reusable RAG evaluation scaffolds"}</li>
              <li>{lang === "zh" ? "业务复盘报告生成模块" : "Business review report generation modules"}</li>
            </ul>
          </article>
        </div>
      </section>
    </div>
  );
}
