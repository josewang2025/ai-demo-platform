import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  Layers,
  LineChart,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { demos } from "@/data/demos";
import { services } from "@/data/services";
import { cn } from "@/lib/utils";

const whoIHelp = [
  {
    icon: Users,
    title: "创业团队与产品负责人",
    titleEn: "Founders & PMs",
    body: "需要把 AI 能力产品化、在预算内验证方向，并做出可演示、可上线的版本。",
  },
  {
    icon: LineChart,
    title: "增长与电商业务团队",
    titleEn: "Growth & Ecommerce",
    body: "希望用数据与 AI 提升转化、复盘活动、把运营动作和指标闭环起来。",
  },
  {
    icon: Building2,
    title: "企业数字化与数据团队",
    titleEn: "Enterprise & Data",
    body: "需要可落地的路线图、供应商协作边界清晰，以及可审计、可迭代的数据与模型方案。",
  },
];

const howIWork = [
  {
    step: "01",
    title: "对齐目标与约束",
    titleEn: "Discovery",
    body: "澄清业务目标、数据现状、合规与上线窗口，明确「成功长什么样」。",
  },
  {
    step: "02",
    title: "原型与验证",
    titleEn: "Build & validate",
    body: "快速搭建可交互原型或试点流程，用真实数据与用户反馈迭代，而不是堆功能清单。",
  },
  {
    step: "03",
    title: "交付与迭代",
    titleEn: "Ship & improve",
    body: "交付可运维的方案与文档，建立指标与复盘节奏，持续优化模型与体验。",
  },
];

export default function HomePage() {
  const featuredDemos = demos.filter((demo) => demo.featured);
  const iconMap = { Zap, Building2, BarChart3 };

  return (
    <div className="relative overflow-hidden">
      {/* Hero */}
      <section className="relative">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_30%,rgba(34,211,238,0.2),transparent_45%),radial-gradient(circle_at_85%_20%,rgba(59,130,246,0.2),transparent_40%),linear-gradient(180deg,#020617_0%,#020617_45%,#030712_100%)]" />
        <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-center">
          <div className="space-y-6">
            <p className="text-sm font-medium tracking-wide text-cyan-300">
              AI 产品咨询 · 数据与落地 · Vancouver
              <span className="ml-2 text-slate-500">/ AI Product &amp; Data Consulting</span>
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              把 AI 做成能上线、能复盘、能增长的业务系统
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-slate-300">
              我帮助团队从「想法与 Demo」走到可交付的产品路径：厘清指标与数据闭环、选型与集成、以及上线后的迭代节奏。适合需要<strong className="font-medium text-slate-100">可执行方案</strong>
              而不仅是概念验证的负责人。
            </p>
            <ul className="max-w-xl space-y-2 text-sm text-slate-400">
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-cyan-400/80" />
                面向业务结果的交付：路线图、原型、试点与复盘，而不是堆模型清单。
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-cyan-400/80" />
                中英文协作经验，熟悉北美与中文市场语境下的产品与数据沟通。
              </li>
            </ul>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "h-11 bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                )}
              >
                预约沟通 <ArrowRight className="ml-2 size-4" />
              </Link>
              <Link
                href="/demos"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-11 border-white/30 bg-transparent text-white hover:bg-white/10"
                )}
              >
                查看业务 Demo
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-end">
            <div className="relative h-72 w-72 overflow-hidden rounded-3xl border border-cyan-300/30 shadow-[0_0_80px_rgba(34,211,238,0.2)] sm:h-80 sm:w-80">
              <Image
                src="/avatar-joseph.png"
                alt="Joseph Wang"
                fill
                sizes="(max-width: 640px) 288px, 320px"
                priority
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Who I Help */}
      <section className="border-t border-white/5 bg-slate-950/50 py-20">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-400/90">Who I help</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">我服务的客户类型</h2>
          <p className="mt-3 max-w-2xl text-slate-400">
            如果你正在把 AI 放进真实业务流程，而不是做一次性的展示，我们很可能聊得来。
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {whoIHelp.map((item) => (
              <Card
                key={item.title}
                className="border-white/10 bg-white/[0.03] text-slate-100 backdrop-blur-sm transition hover:border-cyan-500/30"
              >
                <CardHeader>
                  <div className="mb-3 inline-flex size-10 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300">
                    <item.icon className="size-5" />
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <p className="text-xs text-slate-500">{item.titleEn}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-slate-400">{item.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How I Work */}
      <section className="py-20">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-400/90">How I work</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">合作方式</h2>
          <p className="mt-3 max-w-2xl text-slate-400">三步走：先对齐，再验证，再持续迭代——减少无效开发与返工。</p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {howIWork.map((step) => (
              <div
                key={step.step}
                className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-6"
              >
                <span className="font-mono text-3xl font-semibold text-cyan-500/40">{step.step}</span>
                <h3 className="mt-4 text-lg font-semibold text-white">{step.title}</h3>
                <p className="mt-1 text-xs text-slate-500">{step.titleEn}</p>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{step.body}</p>
                <Layers className="pointer-events-none absolute right-4 top-4 size-16 text-white/[0.04]" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured demos — business use cases */}
      <section className="border-t border-white/5 bg-slate-950/40 py-20">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-400/90">Demos</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">精选业务场景 Demo</h2>
              <p className="mt-3 max-w-2xl text-slate-400">
                每个 Demo 都对应一类常见决策场景：数据复盘、电商运营、研究综合。可先在线体验，再讨论如何嵌入你的流程。
              </p>
            </div>
            <Sparkles className="hidden size-10 text-cyan-500/30 md:block" aria-hidden />
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {featuredDemos.map((demo) => (
              <Card
                key={demo.slug}
                className="flex flex-col border-white/10 bg-white/[0.04] text-slate-100 transition hover:border-cyan-400/40"
              >
                <CardHeader>
                  <CardTitle className="text-xl">{demo.title}</CardTitle>
                  <p className="text-sm font-medium text-cyan-100/90">{demo.valueProposition}</p>
                  {demo.valuePropositionEn ? (
                    <p className="text-xs text-slate-500">{demo.valuePropositionEn}</p>
                  ) : null}
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-4">
                  <p className="text-sm leading-relaxed text-slate-400">{demo.descriptionCn}</p>
                  <div className="flex flex-wrap gap-2">
                    {demo.tags.slice(0, 4).map((tag) => (
                      <span
                        key={`${demo.slug}-${tag}`}
                        className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto flex flex-wrap gap-2 pt-2">
                    <Link
                      href={`/demos/${demo.slug}`}
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "flex-1 border-white/20 bg-transparent text-sm text-white hover:bg-white/10 sm:flex-none"
                      )}
                    >
                      了解场景
                    </Link>
                    <Link
                      href={demo.url}
                      target="_blank"
                      rel="noreferrer"
                      className={cn(
                        buttonVariants({ variant: "default" }),
                        "flex-1 bg-cyan-500 text-slate-950 hover:bg-cyan-400 sm:flex-none"
                      )}
                    >
                      在线体验
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-10">
            <Link
              href="/demos"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "border-white/30 bg-transparent text-white hover:bg-white/10"
              )}
            >
              查看全部 Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Services preview */}
      <section className="py-20">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-400/90">Services</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">可交付的服务</h2>
          <p className="mt-3 max-w-2xl text-slate-400">
            从原型到企业级方案，按阶段合作；先对齐目标，再谈范围与周期。
          </p>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {services.map((service) => {
              const Icon = iconMap[service.icon];
              return (
                <Card
                  key={service.title}
                  className="border-white/10 bg-white/[0.03] text-slate-100 transition hover:border-white/20"
                >
                  <CardHeader>
                    <div className="mb-2 inline-flex size-10 items-center justify-center rounded-lg bg-cyan-500/15 text-cyan-300">
                      <Icon className="size-5" />
                    </div>
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                    <p className="text-xs text-slate-500">{service.titleEn}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-slate-300">{service.description}</p>
                    <p className="border-l-2 border-cyan-500/50 pl-3 text-sm text-cyan-100/90">{service.outcome}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <div className="mt-10">
            <Link
              href="/services"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "border-white/30 bg-transparent text-white hover:bg-white/10"
              )}
            >
              查看服务详情
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-white/5 pb-24 pt-4">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-slate-900/80 to-slate-950 px-6 py-12 sm:px-12">
            <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-cyan-500/20 blur-3xl" />
            <div className="relative max-w-2xl">
              <h2 className="text-2xl font-semibold text-white sm:text-3xl">有明确的业务目标，想讨论 AI 如何落地？</h2>
              <p className="mt-3 text-slate-400">
                发一封简短说明（行业、阶段、期望时间线），我会在 1–2 个工作日内回复是否适合合作，以及建议的下一步。
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "h-11 bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                  )}
                >
                  填写合作意向
                </Link>
                <Link
                  href="mailto:hello@josephjwang.com"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "h-11 border-white/30 bg-transparent text-white hover:bg-white/10"
                  )}
                >
                  或直接发邮件
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
