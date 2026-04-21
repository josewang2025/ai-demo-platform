"use client";

import { useMemo, useState } from "react";
import { PageContainer, PageHero, SiteHeader } from "@/components/layout";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ContactPage() {
  const { locale } = useLanguage();
  const zh = locale === "zh";
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [industry, setIndustry] = useState("");
  const [timeline, setTimeline] = useState("");
  const [goal, setGoal] = useState("");

  const mailtoHref = useMemo(() => {
    const subject = zh ? `合作咨询｜${company || "未填写公司"}` : `Project inquiry | ${company || "No company provided"}`;
    const bodyLines = [
      zh ? "你好 Joseph，" : "Hi Joseph,",
      "",
      `${zh ? "姓名" : "Name"}: ${name || "-"}`,
      `${zh ? "公司/团队" : "Company / Team"}: ${company || "-"}`,
      `${zh ? "行业" : "Industry"}: ${industry || "-"}`,
      `${zh ? "期望时间线" : "Expected Timeline"}: ${timeline || "-"}`,
      `${zh ? "目标" : "Goal"}: ${goal || "-"}`,
      "",
      zh ? "希望进一步沟通合作方案。" : "Would love to discuss a practical delivery plan.",
    ];
    return `mailto:joseph@josephjwang.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
  }, [company, goal, industry, name, timeline, zh]);

  return (
    <main className="min-h-screen page-bg text-gray-900">
      <PageContainer size="narrow">
        <SiteHeader variant="back" />
        <PageHero
          title={zh ? "联系我" : "Contact"}
          description={
            zh
              ? "欢迎发送行业、团队阶段与期望时间线。我会在 1-2 个工作日内回复是否适合合作与建议的下一步。"
              : "Share your industry, stage, and expected timeline. I usually respond in 1-2 business days with next-step recommendations."
          }
        />

        <section className="mt-10 card space-y-4">
          <p className="text-sm text-gray-700">
            <span className="font-semibold text-gray-900">Email:</span> joseph@josephjwang.com
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-semibold text-gray-900">{zh ? "电话" : "Phone"}:</span> +86 134 8223 9970
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-semibold text-gray-900">LinkedIn:</span>{" "}
            <a
              className="text-gray-900 underline decoration-gray-300 underline-offset-4 hover:decoration-gray-600"
              href="https://linkedin.com/in/josephwang-ds"
              target="_blank"
              rel="noreferrer"
            >
              linkedin.com/in/josephwang-ds
            </a>
          </p>
          <div className="pt-3">
            <a href="mailto:joseph@josephjwang.com" className="btn-primary">
              {zh ? "发送邮件沟通" : "Email to Start Discussion"}
            </a>
          </div>
        </section>

        <section className="mt-8 card">
          <h2 className="text-lg font-semibold text-gray-900">{zh ? "快速合作表单" : "Quick Project Brief"}</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            {zh
              ? "填写关键信息后可一键生成邮件。没有后端依赖，适合当前演示站快速收集合作意向。"
              : "Fill key details and generate a prefilled email. No backend required for this demo site."}
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-sm text-gray-700">
              {zh ? "姓名" : "Name"}
              <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" />
            </label>
            <label className="text-sm text-gray-700">
              {zh ? "公司 / 团队" : "Company / Team"}
              <input value={company} onChange={(e) => setCompany(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" />
            </label>
            <label className="text-sm text-gray-700">
              {zh ? "行业" : "Industry"}
              <input value={industry} onChange={(e) => setIndustry(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" />
            </label>
            <label className="text-sm text-gray-700">
              {zh ? "期望时间线" : "Timeline"}
              <input value={timeline} onChange={(e) => setTimeline(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" />
            </label>
            <label className="text-sm text-gray-700 sm:col-span-2">
              {zh ? "业务目标" : "Business Goal"}
              <textarea value={goal} onChange={(e) => setGoal(e.target.value)} rows={4} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" />
            </label>
          </div>
          <div className="mt-5">
            <a href={mailtoHref} className="btn-primary">
              {zh ? "生成邮件并发送" : "Generate Prefilled Email"}
            </a>
          </div>
        </section>
      </PageContainer>
    </main>
  );
}
