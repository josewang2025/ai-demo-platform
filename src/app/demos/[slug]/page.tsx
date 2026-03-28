import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { demos } from "@/data/demos";
import { cn } from "@/lib/utils";

type DemoDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function DemoDetailPage({ params }: DemoDetailPageProps) {
  const { slug } = await params;
  const demo = demos.find((item) => item.slug === slug);

  if (!demo) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <Link
        href="/demos"
        className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
      >
        <ArrowLeft className="size-4" />
        返回 Demo 列表
      </Link>

      <header className="mt-8 max-w-3xl">
        <p className="text-sm font-medium text-cyan-400/90">Demo</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white">{demo.title}</h1>
        <p className="mt-4 text-lg text-cyan-100/90">{demo.valueProposition}</p>
        <p className="mt-2 text-slate-400">{demo.descriptionCn}</p>
        <p className="mt-2 text-sm text-slate-500">{demo.description}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {demo.tags.map((tag) => (
            <span
              key={`${demo.slug}-${tag}`}
              className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      {/* What this demo does */}
      <section className="mt-14">
        <h2 className="text-xl font-semibold text-white">这个 Demo 做什么</h2>
        <p className="mt-4 max-w-3xl whitespace-pre-wrap text-base leading-relaxed text-slate-400">
          {demo.whatItDoes}
        </p>
      </section>

      {/* Example use cases */}
      <section className="mt-14">
        <h2 className="text-xl font-semibold text-white">典型使用场景</h2>
        <ul className="mt-6 space-y-4">
          {demo.useCases.map((uc) => (
            <li
              key={uc.title}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4"
            >
              <h3 className="font-medium text-white">{uc.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{uc.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Embedded preview */}
      <section className="mt-14">
        <h2 className="text-xl font-semibold text-white">在线预览</h2>
        <p className="mt-2 text-sm text-slate-500">
          下方为嵌入预览。若被目标站点的安全策略拦截，请使用「新窗口打开」。
        </p>
        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-2xl shadow-black/40">
          <iframe
            src={demo.url}
            title={`${demo.title} demo`}
            className="aspect-[16/10] min-h-[420px] w-full sm:min-h-[560px]"
            loading="lazy"
            allow="clipboard-read; clipboard-write"
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={demo.url}
            target="_blank"
            rel="noreferrer"
            className={cn(
              buttonVariants({ variant: "default" }),
              "bg-cyan-500 text-slate-950 hover:bg-cyan-400"
            )}
          >
            新窗口打开 Demo
            <ExternalLink className="ml-2 size-4" />
          </Link>
          <Link
            href={demo.github}
            target="_blank"
            rel="noreferrer"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "border-white/20 bg-transparent text-white hover:bg-white/10"
            )}
          >
            查看源码（GitHub）
          </Link>
        </div>
      </section>

      {/* Technologies */}
      <section className="mt-14">
        <h2 className="text-xl font-semibold text-white">相关技术</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {demo.technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-3 py-1.5 text-sm text-cyan-100/90"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-16 rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-transparent px-6 py-10 sm:px-10">
        <h2 className="text-xl font-semibold text-white">希望把类似能力接入你的产品或数据流程？</h2>
        <p className="mt-3 max-w-2xl text-sm text-slate-400">
          说明你的行业、数据形态与上线窗口，我可以反馈是否适合深度合作，以及建议的试点范围。
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/contact"
            className={cn(
              buttonVariants({ variant: "default" }),
              "bg-cyan-500 text-slate-950 hover:bg-cyan-400"
            )}
          >
            联系我
          </Link>
          <Link
            href="mailto:hello@josephjwang.com?subject=Demo%20%E5%92%A8%E8%AF%A2"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "border-white/25 bg-transparent text-white hover:bg-white/10"
            )}
          >
            邮件沟通
          </Link>
        </div>
      </section>
    </div>
  );
}
