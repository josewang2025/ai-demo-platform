import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { demos } from "@/data/demos";
import { cn } from "@/lib/utils";

export default function DemosPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <div className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-400/90">Demos</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white">业务场景 Demo</h1>
        <p className="mt-4 text-lg text-slate-400">
          以下演示对应真实决策场景：数据复盘、电商运营、研究综合。可先在线体验，再讨论如何与你的产品或数据栈集成。
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Interactive demos · No sign-up required for preview
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {demos.map((demo) => (
          <Card
            key={demo.slug}
            className="group flex flex-col overflow-hidden border-white/10 bg-white/[0.03] text-slate-100 shadow-none transition hover:border-cyan-500/35 hover:bg-white/[0.05]"
          >
            <div className="h-1 bg-gradient-to-r from-cyan-500/60 via-sky-500/40 to-transparent opacity-80 transition group-hover:opacity-100" />
            <CardHeader className="space-y-3 pb-2">
              <CardTitle className="text-xl font-semibold leading-snug">{demo.title}</CardTitle>
              <p className="text-base font-medium leading-snug text-cyan-100/95">{demo.valueProposition}</p>
              {demo.valuePropositionEn ? (
                <p className="text-xs leading-relaxed text-slate-500">{demo.valuePropositionEn}</p>
              ) : null}
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-4 pt-0">
              <p className="text-sm leading-relaxed text-slate-400">{demo.descriptionCn}</p>
              <div className="flex flex-wrap gap-2">
                {demo.tags.map((tag) => (
                  <span
                    key={`${demo.slug}-${tag}`}
                    className="rounded-md border border-white/10 bg-slate-950/40 px-2.5 py-1 text-xs font-medium text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </CardContent>
            <CardFooter className="mt-auto flex flex-col gap-2 border-t border-white/5 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href={`/demos/${demo.slug}`}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "w-full justify-center text-slate-300 hover:bg-white/10 hover:text-white sm:w-auto"
                )}
              >
                场景说明
                <ArrowUpRight className="ml-1 size-4 opacity-70" />
              </Link>
              <div className="flex w-full gap-2 sm:w-auto">
                <Link
                  href={demo.url}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "flex-1 bg-cyan-500 text-slate-950 hover:bg-cyan-400 sm:flex-none"
                  )}
                >
                  打开 Demo
                  <ExternalLink className="ml-1.5 size-3.5" />
                </Link>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
