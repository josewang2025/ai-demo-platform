import Link from "next/link";

const posts = [
  { slug: "ai-product-playbook", title: "AI 产品落地 Playbook" },
  { slug: "from-dashboard-to-action", title: "从看报表到做决策" },
];

export default function BlogPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-semibold text-white">博客</h1>
      <p className="mt-3 text-slate-300">记录 AI 产品实践、增长方法与跨境业务观察。</p>
      <div className="mt-8 grid gap-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-slate-200 transition hover:border-cyan-400/40"
          >
            {post.title}
          </Link>
        ))}
      </div>
    </section>
  );
}
