"use client";

import { PageContainer, PageHero, SiteHeader } from "@/components/layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { ResumePageContent } from "@/components/resume/ResumePageContent";

export default function ResumePage() {
  const { locale } = useLanguage();
  const [copied, setCopied] = useState(false);
  const copy = {
    title: locale === "zh" ? "汪久量 | 职业履历" : "Joseph Wang | Resume",
    subtitle:
      locale === "zh"
        ? "AI 应用工程师 / LLM Engineer / Agent Automation · 上海（可远程 / 全球远程）"
        : "AI Application Engineer / LLM Engineer / Agent Automation · Shanghai (Remote / Global)",
    download: locale === "zh" ? "下载 PDF 简历" : "Download PDF Resume",
    linkedin: locale === "zh" ? "LinkedIn 主页" : "View LinkedIn",
    email: locale === "zh" ? "发送邮件" : "Send Email",
  };
  const contactLine = "joseph@josephjwang.com | +86 134 8223 9970 | linkedin.com/in/josephwang-ds";
  async function copyContact() {
    try {
      await navigator.clipboard.writeText(contactLine);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  }
  return (
    <main className="min-h-screen page-bg text-gray-900">
      <PageContainer>
        <SiteHeader variant="back" />
        <PageHero
          title={copy.title}
          description={copy.subtitle}
          metaLine="joseph@josephjwang.com · +86 134 8223 9970 · linkedin.com/in/josephwang-ds"
          actions={[
            { label: copy.download, href: "/Joseph_Wang_Resume.pdf", variant: "primary", download: true },
            { label: copy.email, href: "mailto:joseph@josephjwang.com", variant: "secondary" },
            { label: copy.linkedin, href: "https://linkedin.com/in/josephwang-ds", variant: "secondary", external: true },
          ]}
        />
        <div className="mt-3">
          <button type="button" className="btn-secondary py-2.5 px-4" onClick={copyContact}>
            {copied ? (locale === "zh" ? "已复制" : "Copied") : locale === "zh" ? "复制联系方式" : "Copy Contact"}
          </button>
        </div>
        <ResumePageContent />
      </PageContainer>
    </main>
  );
}
