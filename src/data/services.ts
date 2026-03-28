export type ServiceItem = {
  title: string;
  titleEn: string;
  description: string;
  /** 首页预览区强调的成果或交付 */
  outcome: string;
  icon: "Zap" | "Building2" | "BarChart3";
};

export const services: ServiceItem[] = [
  {
    title: "AI 原型开发",
    titleEn: "AI Prototype Development",
    description: "快速将你的 AI 想法变成可演示的产品原型，2 周内交付",
    outcome: "2 周内可演示原型，便于对齐投资人与业务方",
    icon: "Zap",
  },
  {
    title: "企业 AI 咨询",
    titleEn: "Enterprise AI Consulting",
    description: "为企业量身定制 AI 落地方案，从数据到部署全流程支持",
    outcome: "路线图 + 风险清单 + 落地路径，减少走弯路成本",
    icon: "Building2",
  },
  {
    title: "产品数据分析",
    titleEn: "Product Analytics",
    description: "ML 驱动的用户行为分析、A/B 测试和增长策略",
    outcome: "指标与实验闭环，让增长决策有依据、可复盘",
    icon: "BarChart3",
  },
];
