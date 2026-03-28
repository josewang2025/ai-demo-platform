import Link from "next/link";
import { Mail, MessageSquare } from "lucide-react";

import { ContactForm } from "./ContactForm";

const collaborationOptions = [
  {
    title: "AI 原型与试点",
    detail: "在数周内交付可演示、可接入真实数据的版本，验证价值后再扩展范围。",
  },
  {
    title: "咨询与路线图",
    detail: "梳理业务目标、数据与合规边界，输出可执行的路线图与优先级。",
  },
  {
    title: "数据与增长",
    detail: "指标体系、实验设计与分析，让增长动作可复盘、可迭代。",
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-400/90">Contact</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white">合作与咨询</h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-400">
            若你正在推进 AI 产品落地、需要数据与实验闭环，或希望评估外部协作方式，欢迎先留下简要信息。我会根据匹配度回复是否适合深度合作，以及建议的下一步（通常为一次短通话或书面反馈）。
          </p>
          <p className="mt-4 text-sm text-slate-500">
            Bilingual OK · Pacific time friendly · Remote-first
          </p>

          <div className="mt-10 space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex gap-3">
              <Mail className="mt-0.5 size-5 shrink-0 text-cyan-400/80" />
              <div>
                <p className="text-sm font-medium text-white">直接邮件</p>
                <Link
                  href="mailto:hello@josephjwang.com"
                  className="text-sm text-cyan-300 hover:underline"
                >
                  hello@josephjwang.com
                </Link>
              </div>
            </div>
            <div className="flex gap-3">
              <MessageSquare className="mt-0.5 size-5 shrink-0 text-cyan-400/80" />
              <div>
                <p className="text-sm font-medium text-white">回复预期</p>
                <p className="text-sm text-slate-400">工作日 1–2 个工作日内回复（非紧急）</p>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-lg font-semibold text-white">合作类型</h2>
            <ul className="mt-4 space-y-4">
              {collaborationOptions.map((item) => (
                <li key={item.title} className="border-l-2 border-cyan-500/40 pl-4">
                  <p className="font-medium text-slate-200">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-white">填写意向</h2>
            <p className="mt-2 text-sm text-slate-500">
              信息越具体（行业、阶段、时间线），越能判断是否需要安排深度沟通。
            </p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
