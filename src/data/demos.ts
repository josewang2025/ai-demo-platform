export type DemoUseCase = {
  title: string;
  detail: string;
};

export type DemoItem = {
  slug: string;
  title: string;
  description: string;
  descriptionCn: string;
  /** 一句话价值主张（卡片 / 首页） */
  valueProposition: string;
  /** 英文辅助一句话 */
  valuePropositionEn?: string;
  /** 「这个 Demo 做什么」段落 */
  whatItDoes: string;
  /** 典型业务场景 */
  useCases: DemoUseCase[];
  /** 相关技术栈标签 */
  technologies: string[];
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
    valueProposition: "把经营数据变成可汇报、可行动的结论与建议",
    valuePropositionEn: "From CSV to KPIs and executive-ready insights",
    whatItDoes:
      "上传或接入示例 CSV，系统自动完成趋势、异常与结构拆解，并生成面向管理层的中文摘要与可执行建议。适合在会议前快速对齐数据、在复盘时沉淀可复用的分析框架。",
    useCases: [
      {
        title: "经营复盘与季度汇报",
        detail: "为管理层准备一份带 KPI 快照与趋势解读的摘要，减少手工做表与 PPT 时间。",
      },
      {
        title: "区域 / 品类表现诊断",
        detail: "快速定位增长或下滑的细分维度，并给出后续追问方向。",
      },
      {
        title: "数据对齐工作坊",
        detail: "用同一份样例数据与团队讨论「指标口径」与「下一步实验」。",
      },
    ],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Multi-model AI routing", "CSV"],
    tags: ["AI", "Data", "CSV", "Analytics"],
    url: "/analyst",
    github: "https://github.com/josewang2025/ai-demo-platform",
    featured: true,
  },
  {
    slug: "ai-ecommerce-analyst",
    title: "AI Ecommerce Analyst",
    description:
      "Analyze store performance, product trends, and revenue signals with AI-generated recommendations.",
    descriptionCn: "分析店铺表现、产品趋势和收入信号，生成 AI 驱动的业务建议",
    valueProposition: "把店铺与商品数据转成可执行的运营与增长建议",
    valuePropositionEn: "Store & product signals → revenue-focused actions",
    whatItDoes:
      "围绕电商导出的订单、商品与转化数据，提供可视化洞察与顾问式建议。你可以用自然语言追问「哪些 SKU 拖累毛利」「该加大推广还是补货」等，帮助运营与增长团队在同一套数据上对齐决策。",
    useCases: [
      {
        title: "大促与活动复盘",
        detail: "对比活动前后收入与转化，识别高贡献 SKU 与潜在库存风险。",
      },
      {
        title: "商品与类目运营",
        detail: "识别表现分化明显的商品线，辅助制定投放与补货策略。",
      },
      {
        title: "跨渠道增长讨论",
        detail: "用同一份样例数据与团队演练「从数据到行动」的协作流程。",
      },
    ],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Multi-model AI routing", "Ecommerce CSV"],
    tags: ["AI", "Ecommerce", "Analytics", "Revenue"],
    url: "/ecommerce",
    github: "https://github.com/josewang2025/ai-demo-platform",
    featured: true,
  },
  {
    slug: "ai-research-agent",
    title: "AI Research Agent",
    description:
      "Synthesize complex topics into structured findings and decision-ready reports.",
    descriptionCn: "将复杂主题综合成结构化研究报告和决策支持文档",
    valueProposition: "把复杂主题沉淀成可汇报的结构化报告与决策依据",
    valuePropositionEn: "From topic to structured findings & recommendations",
    whatItDoes:
      "输入研究主题与深度偏好，系统生成包含摘要、关键发现、对比与建议等模块的结构化输出。适合市场/竞品扫描、技术选型预研、跨境业务机会梳理等需要「可交付文档」的场景。",
    useCases: [
      {
        title: "竞品与市场格局扫描",
        detail: "在有限时间内形成结构化结论，便于内部对齐与决策讨论。",
      },
      {
        title: "产品与技术选型预研",
        detail: "把分散信息整理成可复用的研究框架，便于后续立项或评审。",
      },
      {
        title: "管理层简报材料",
        detail: "输出偏「报告」而非「聊天」的版式，便于二次加工或分享。",
      },
    ],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Multi-model AI routing", "Research workflow"],
    tags: ["AI", "Research", "Agent", "Report"],
    url: "/research",
    github: "https://github.com/josewang2025/ai-demo-platform",
    featured: true,
  },
];
