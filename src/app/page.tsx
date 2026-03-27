import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BarChart3, Building2, Zap } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { demos } from "@/data/demos";
import { services } from "@/data/services";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const featuredDemos = demos.filter((demo) => demo.featured);
  const iconMap = { Zap, Building2, BarChart3 };

  return (
    <div className="relative overflow-hidden">
      <section className="relative">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_30%,rgba(34,211,238,0.2),transparent_45%),radial-gradient(circle_at_85%_20%,rgba(59,130,246,0.2),transparent_40%),linear-gradient(180deg,#020617_0%,#020617_45%,#030712_100%)]" />
        <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-center">
          <div className="space-y-6">
            <p className="text-sm text-cyan-300">
              AI Product Builder · Product &amp; ML Data Scientist · Vancouver
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              构建真正可用的 AI 产品
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-slate-300">
              连接产品、数据和模型能力，专注把 AI 从 Demo 推进到可上线、可增长、可持续优化的真实业务系统。
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/demos"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "h-11 bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                )}
              >
                查看 Demo <ArrowRight className="ml-2 size-4" />
              </Link>
              <Link
                href="/contact"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-11 border-white/30 bg-transparent text-white hover:bg-white/10"
                )}
              >
                合作咨询
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-end">
            <div className="relative h-72 w-72 overflow-hidden rounded-3xl border border-cyan-300/30 shadow-[0_0_80px_rgba(34,211,238,0.2)] sm:h-80 sm:w-80">
              <Image
                src="/avatar-joseph.png"
                alt="Joseph Wang Avatar"
                fill
                sizes="(max-width: 640px) 288px, 320px"
                priority
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-3xl font-semibold text-white">精选 Demo</h2>
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {featuredDemos.map((demo) => (
            <Card key={demo.slug} className="border-white/10 bg-white/5 text-slate-100">
              <CardHeader>
                <CardTitle>{demo.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-300">{demo.descriptionCn}</p>
                <div className="flex flex-wrap gap-2">
                  {demo.tags.map((tag) => (
                    <span
                      key={`${demo.slug}-${tag}`}
                      className="rounded-full border border-cyan-400/30 px-2.5 py-1 text-xs text-cyan-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/demos/${demo.slug}`}
                  className="inline-flex text-sm text-cyan-300 underline-offset-4 hover:underline"
                >
                  查看详情
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-8">
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
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
        <h2 className="text-3xl font-semibold text-white">服务</h2>
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {services.map((service) => {
            const Icon = iconMap[service.icon];
            return (
              <Card key={service.title} className="border-white/10 bg-white/5 text-slate-100">
                <CardHeader>
                  <div className="mb-2 inline-flex size-9 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-300">
                    <Icon className="size-5" />
                  </div>
                  <CardTitle>{service.title}</CardTitle>
                  <p className="text-xs text-slate-400">{service.titleEn}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-300">{service.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <div className="mt-8">
          <Link
            href="/services"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "border-white/30 bg-transparent text-white hover:bg-white/10"
            )}
          >
            了解更多
          </Link>
        </div>
      </section>
    </div>
  );
}
