import { notFound } from "next/navigation";

const posts = [
  {
    slug: "ai-product-playbook",
    title: "AI 产品落地 Playbook",
    content: "从业务目标出发，先定义关键路径和反馈回路，再选择最合适的模型与工程方案。",
  },
  {
    slug: "from-dashboard-to-action",
    title: "从看报表到做决策",
    content: "数据价值不在可视化本身，而在让团队更快更稳地做出行动并复盘结果。",
  },
];

type BlogDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-semibold text-white">{post.title}</h1>
      <p className="mt-5 leading-relaxed text-slate-300">{post.content}</p>
    </section>
  );
}
