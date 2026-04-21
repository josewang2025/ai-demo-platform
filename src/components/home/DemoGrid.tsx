"use client";

import { DemoCard } from "@/components/ui";
import { SectionHeader } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";

export function DemoGrid() {
  const { locale } = useLanguage();
  const copy =
    locale === "zh"
      ? {
          support: "精选业务场景 Demo，可在线体验并持续更新",
          title: "精选 Demo",
          description: "每个 Demo 对应一类真实决策场景，先看效果，再讨论如何嵌入你的业务流程。",
          cards: [
            {
              title: "AI Data Analyst",
              description: "把 CSV 和经营数据转成 KPI 快照、趋势判断与可执行建议。",
              cta: "在线体验",
              href: "/analyst",
            },
            {
              title: "AI Ecommerce Analyst",
              description: "从店铺与商品信号中识别增长机会、风险点与下周动作。",
              cta: "在线体验",
              href: "/ecommerce",
            },
            {
              title: "AI Research Assistant",
              description: "将复杂主题沉淀为结构化研究结论与决策支持文档。",
              cta: "在线体验",
              href: "/research",
            },
          ],
        }
      : {
          support: "Curated business demos with continuous updates",
          title: "Featured Demos",
          description:
            "Each demo maps to a practical decision workflow so teams can evaluate fit before implementation.",
          cards: [
            {
              title: "AI Data Analyst",
              description: "Turn CSV and business metrics into KPI snapshots, trends, and action-ready insights.",
              cta: "Try Demo",
              href: "/analyst",
            },
            {
              title: "AI Ecommerce Analyst",
              description: "Convert store and product signals into growth opportunities and risk-focused actions.",
              cta: "Try Demo",
              href: "/ecommerce",
            },
            {
              title: "AI Research Assistant",
              description: "Synthesize complex topics into structured findings and decision-ready recommendations.",
              cta: "Try Demo",
              href: "/research",
            },
          ],
        };
  return (
    <section id="demos" className="scroll-mt-8 pt-16 pb-20 md:pt-20 md:pb-24">
      <p className="mb-2 text-center text-sm font-medium text-gray-500">
        {copy.support}
      </p>
      <SectionHeader
        title={copy.title}
        description={copy.description}
      />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {copy.cards.map((demo) => (
          <DemoCard
            key={demo.href}
            title={demo.title}
            description={demo.description}
            ctaLabel={demo.cta}
            href={demo.href}
          />
        ))}
      </div>
    </section>
  );
}
