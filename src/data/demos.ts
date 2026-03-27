export type DemoItem = {
  slug: string;
  title: string;
  description: string;
  descriptionCn: string;
  tags: string[];
  url: string;
  github: string;
  featured: boolean;
};

export const demos: DemoItem[] = [
  {
    slug: "ai-data-analyst",
    title: "AI Data Analyst",
    description:
      "Turn raw CSV data into trends, KPI snapshots, and actionable business insights.",
    descriptionCn: "将原始 CSV 数据转化为趋势分析、KPI 快照和可执行的业务洞察",
    tags: ["AI", "Data", "CSV", "Analytics"],
    url: "https://ai-demo-platform.vercel.app/analyst",
    github: "https://github.com/josewang2025/ai-demo-platform",
    featured: true,
  },
  {
    slug: "ai-ecommerce-analyst",
    title: "AI Ecommerce Analyst",
    description:
      "Analyze store performance, product trends, and revenue signals with AI-generated recommendations.",
    descriptionCn: "分析店铺表现、产品趋势和收入信号，生成 AI 驱动的业务建议",
    tags: ["AI", "Ecommerce", "Analytics", "Revenue"],
    url: "https://ai-demo-platform.vercel.app/ecommerce",
    github: "https://github.com/josewang2025/ai-demo-platform",
    featured: true,
  },
  {
    slug: "ai-research-agent",
    title: "AI Research Agent",
    description:
      "Synthesize complex topics into structured findings and decision-ready reports.",
    descriptionCn: "将复杂主题综合成结构化研究报告和决策支持文档",
    tags: ["AI", "Research", "Agent", "Report"],
    url: "https://ai-demo-platform.vercel.app/research",
    github: "https://github.com/josewang2025/ai-demo-platform",
    featured: true,
  },
];
