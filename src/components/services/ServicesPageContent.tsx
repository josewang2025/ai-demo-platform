"use client";

import { useLanguage } from "@/contexts/LanguageContext";

const SERVICE_BLOCKS = {
  zh: [
    {
      title: "AI 原型开发",
      desc: "2-4 周交付可演示原型，快速对齐业务方与投资方预期。",
      deliverables: ["交互原型", "核心能力链路", "试点场景验证"],
    },
    {
      title: "企业 AI 咨询",
      desc: "从数据到模型到流程，给出可执行路线图与风险清单。",
      deliverables: ["落地路线图", "技术选型建议", "实施边界与里程碑"],
    },
    {
      title: "产品数据与增长分析",
      desc: "构建指标闭环与实验框架，让增长决策可量化、可复盘。",
      deliverables: ["指标体系", "A/B 测试框架", "复盘与优化建议"],
    },
  ],
  en: [
    {
      title: "AI Prototype Delivery",
      desc: "Build a demo-ready product in 2-4 weeks to align stakeholders quickly.",
      deliverables: ["Interactive prototype", "Core capability chain", "Pilot validation"],
    },
    {
      title: "Enterprise AI Consulting",
      desc: "From data readiness to model orchestration and workflow rollout.",
      deliverables: ["Execution roadmap", "Architecture recommendations", "Milestone plan"],
    },
    {
      title: "Product Analytics & Growth",
      desc: "Build measurable loops with experiment-backed optimization.",
      deliverables: ["Metrics framework", "A/B testing setup", "Iteration briefings"],
    },
  ],
};

export function ServicesPageContent() {
  const { locale } = useLanguage();
  const lang = locale === "zh" ? "zh" : "en";
  const flow =
    lang === "zh"
      ? [
          { title: "01 对齐目标", desc: "澄清业务目标、约束与上线窗口。" },
          { title: "02 原型验证", desc: "快速搭建并用真实反馈迭代。" },
          { title: "03 交付迭代", desc: "交付可运维方案并建立复盘机制。" },
        ]
      : [
          { title: "01 Discovery", desc: "Align business outcomes, constraints, and launch timing." },
          { title: "02 Build & Validate", desc: "Prototype fast and iterate with real data feedback." },
          { title: "03 Ship & Improve", desc: "Deliver production workflow and improve with review cycles." },
        ];

  return (
    <div className="mt-10 space-y-10">
      <section className="grid gap-6 md:grid-cols-3">
        {SERVICE_BLOCKS[lang].map((service) => (
          <article key={service.title} className="card">
            <h2 className="text-base font-semibold text-gray-900">{service.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-700">{service.desc}</p>
            <ul className="mt-4 list-disc space-y-1.5 pl-4 text-sm text-gray-600">
              {service.deliverables.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="card">
        <h2 className="text-lg font-semibold text-gray-900">{lang === "zh" ? "合作流程" : "Engagement Model"}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {flow.map((step) => (
            <article key={step.title} className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
              <h3 className="text-sm font-semibold text-gray-900">{step.title}</h3>
              <p className="mt-2 text-sm text-gray-700">{step.desc}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
