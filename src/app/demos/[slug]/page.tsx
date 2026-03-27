import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

import { demos } from "@/data/demos";

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
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <Link
        href="/demos"
        className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white"
      >
        <ArrowLeft className="size-4" />
        返回 Demo 列表
      </Link>

      <h1 className="text-3xl font-semibold text-white">{demo.title}</h1>
      <p className="mt-4 text-slate-300">{demo.descriptionCn}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {demo.tags.map((tag) => (
          <span
            key={`${demo.slug}-${tag}`}
            className="rounded-full border border-cyan-400/30 px-2.5 py-1 text-xs text-cyan-200"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={demo.github}
          target="_blank"
          rel="noreferrer"
          className="rounded-md border border-white/20 px-4 py-2 text-sm text-slate-100 hover:bg-white/10"
        >
          查看 GitHub
        </Link>
        <Link
          href={demo.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 rounded-md bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-cyan-400"
        >
          新标签打开 <ExternalLink className="size-4" />
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-white/10 bg-black/30">
        <iframe
          src={demo.url}
          title={`${demo.title} demo`}
          className="h-[70vh] w-full"
          loading="lazy"
        />
      </div>
    </section>
  );
}
