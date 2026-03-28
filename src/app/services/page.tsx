import { services } from "@/data/services";

export default function ServicesPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-semibold text-white">服务</h1>
      <p className="mt-3 text-slate-300">面向创业团队与业务负责人，提供从策略到落地的 AI 产品支持。</p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {services.map((service) => (
          <article key={service.title} className="rounded-xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-medium text-white">{service.title}</h2>
            <p className="mt-1 text-xs text-slate-500">{service.titleEn}</p>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">{service.description}</p>
            <p className="mt-3 border-l-2 border-cyan-500/40 pl-3 text-sm text-cyan-100/90">{service.outcome}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
