"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { SectionHeader } from "@/components/ui";

export function AudienceSplitSection() {
  const { locale } = useLanguage();
  const copy =
    locale === "zh"
      ? {
          title: "你可以从这里开始",
          description: "同一个网站同时服务招聘方与企业客户，按目标快速进入对应内容。",
          cards: [
            {
              title: "给招聘方",
              desc: "查看完整履历、量化项目成果与技术栈，快速判断岗位匹配度。",
              cta: "查看履历",
              href: "/resume",
            },
            {
              title: "给企业客户",
              desc: "了解可交付服务、合作流程与业务场景 Demo，评估落地可行性。",
              cta: "查看服务",
              href: "/services",
            },
          ],
        }
      : {
          title: "Start here",
          description: "One site for both hiring teams and business clients.",
          cards: [
            {
              title: "For Recruiters",
              desc: "Review full experience, quantified impact, and technical stack for role fit.",
              cta: "View Resume",
              href: "/resume",
            },
            {
              title: "For Clients",
              desc: "See deliverables, engagement model, and demos before scoping your project.",
              cta: "View Services",
              href: "/services",
            },
          ],
        };

  return (
    <section className="pt-6 pb-16 md:pb-20">
      <SectionHeader title={copy.title} description={copy.description} />
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {copy.cards.map((card) => (
          <div key={card.title} className="card">
            <h3 className="text-lg font-semibold text-gray-900">{card.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">{card.desc}</p>
            <Link href={card.href} className="mt-6 inline-block btn-secondary py-2.5 px-4">
              {card.cta}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
