import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { demos } from "@/data/demos";

export default function DemosPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-semibold text-white">Demo</h1>
      <p className="mt-3 text-slate-300">精选 AI 产品与数据系统实践。</p>
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {demos.map((demo) => (
          <Card
            key={demo.slug}
            className="border-white/10 bg-white/5 text-slate-100 transition hover:border-cyan-400/50"
          >
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl">{demo.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-relaxed text-slate-300">{demo.descriptionCn}</p>
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
            </CardContent>
            <CardFooter className="flex items-center justify-between gap-3">
              <Link
                href={`/demos/${demo.slug}`}
                className="text-sm text-slate-300 underline-offset-4 hover:text-white hover:underline"
              >
                查看详情
              </Link>
              <Link
                href={demo.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-md bg-cyan-500 px-3 py-2 text-xs font-medium text-slate-950 hover:bg-cyan-400"
              >
                打开 Demo <ExternalLink className="size-3.5" />
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
