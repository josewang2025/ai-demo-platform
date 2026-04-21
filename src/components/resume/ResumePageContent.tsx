"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { coreCapabilities, experiences, profileSummary } from "@/content/profile";

export function ResumePageContent() {
  const { locale } = useLanguage();
  const lang = locale === "zh" ? "zh" : "en";
  const education =
    lang === "zh"
      ? [
          "Northwestern University｜数据科学硕士（M.S. Data Science）",
          "University of Waterloo｜数学学士（精算科学 + 统计学双专业）",
        ]
      : [
          "Northwestern University | M.S. Data Science",
          "University of Waterloo | B.Math (Actuarial Science + Statistics)",
        ];
  const training =
    lang === "zh"
      ? [
          "AI 大模型应用开发系统培训：LLM API、Function Calling、RAG、Agent 设计模式（Workflow / ReAct / 多 Agent 编排）",
          "Dify 私有化部署与 AI 工作流设计",
          "AI 辅助开发工具：Cursor、Claude Code、Codex、Trae、通义灵码",
        ]
      : [
          "LLM application training: API integration, function calling, RAG, and agent patterns (Workflow / ReAct / multi-agent).",
          "Dify private deployment and AI workflow design.",
          "AI-assisted engineering tools: Cursor, Claude Code, Codex, Trae, Tongyi Lingma.",
        ];

  return (
    <div className="mt-10 space-y-10">
      <section className="card">
        <h2 className="text-lg font-semibold text-gray-900">{lang === "zh" ? "个人简介" : "Professional Summary"}</h2>
        <p className="mt-3 text-sm leading-relaxed text-gray-700">{profileSummary[lang]}</p>
      </section>

      <section className="card">
        <h2 className="text-lg font-semibold text-gray-900">{lang === "zh" ? "核心能力" : "Core Capabilities"}</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {coreCapabilities[lang].map((group) => (
            <article key={group.title} className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
              <h3 className="text-sm font-semibold text-gray-900">{group.title}</h3>
              <ul className="mt-3 list-disc space-y-1.5 pl-4 text-sm text-gray-700">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="card">
        <h2 className="text-lg font-semibold text-gray-900">{lang === "zh" ? "工作经历" : "Professional Experience"}</h2>
        <div className="mt-6 space-y-6">
          {experiences[lang].map((exp) => (
            <article key={`${exp.role}-${exp.period}`} className="rounded-xl border border-gray-100 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-base font-semibold text-gray-900">{exp.role}</h3>
                <span className="text-xs text-gray-500">{exp.period}</span>
              </div>
              <p className="mt-1 text-sm text-gray-600">{exp.company}</p>
              <ul className="mt-3 list-disc space-y-1.5 pl-4 text-sm text-gray-700">
                {exp.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="card">
        <h2 className="text-lg font-semibold text-gray-900">{lang === "zh" ? "教育背景" : "Education"}</h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-4 text-sm text-gray-700">
          {education.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2 className="text-lg font-semibold text-gray-900">
          {lang === "zh" ? "专业培训与持续学习" : "Professional Training"}
        </h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-4 text-sm text-gray-700">
          {training.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
