export type LocaleCopy = "en" | "zh";

export const profileSummary: Record<LocaleCopy, string> = {
  zh: "具备 9 年以上数据分析、建模与自动化经验，6 年以上机器学习与应用数据科学经验，专注将 LLM、RAG、Agent 与自动化工作流落地为可复用、可交付的业务系统。",
  en: "9+ years in analytics, modeling, and automation, including 6+ years in machine learning and applied data science. Focused on turning LLM, RAG, and agent capabilities into deliverable business systems.",
};

export const coreCapabilities: Record<LocaleCopy, Array<{ title: string; items: string[] }>> = {
  zh: [
    {
      title: "LLM 应用与系统设计",
      items: [
        "Prompt Engineering、Function Calling、工具调用、Agent 编排",
        "多模型路由与容错：Qwen / DeepSeek / Claude / GPT",
        "RAG（向量检索 + 关键词混合检索）",
        "评估集设计、准确率与幻觉率优化",
      ],
    },
    {
      title: "自动化与平台",
      items: ["Coze、Dify（ChatFlow / Workflow）、n8n、MCP、Webhook / API 集成"],
    },
    {
      title: "工程与数据",
      items: [
        "Python（Pandas / Scikit-learn / Flask）、SQL、Docker、Git、AWS（基础）",
        "Power BI / Tableau / ECharts 可视化",
      ],
    },
    {
      title: "机器学习与分析",
      items: [
        "XGBoost、LightGBM、Prophet、ARIMA",
        "定价优化、需求预测、用户分群、流失预警",
        "NLP 情感分析、主题归因、A/B 测试",
      ],
    },
  ],
  en: [
    {
      title: "LLM Applications & System Design",
      items: [
        "Prompt engineering, function calling, tool use, and agent orchestration",
        "Multi-model routing and failover across Qwen, DeepSeek, Claude, and GPT",
        "RAG with hybrid retrieval (vector + keyword)",
        "Evaluation design and hallucination-control optimization",
      ],
    },
    {
      title: "Automation Platforms",
      items: ["Coze, Dify (ChatFlow / Workflow), n8n, MCP, Webhook/API integrations"],
    },
    {
      title: "Engineering & Data",
      items: [
        "Python (Pandas / Scikit-learn / Flask), SQL, Docker, Git, AWS basics",
        "Visualization with Power BI, Tableau, and ECharts",
      ],
    },
    {
      title: "ML & Analytics",
      items: [
        "XGBoost, LightGBM, Prophet, ARIMA",
        "Pricing optimization, demand forecasting, segmentation, churn warning",
        "NLP sentiment/topic pipelines and A/B testing",
      ],
    },
  ],
};

export const experiences = {
  zh: [
    {
      role: "创始人 & AI 数据科学家",
      company: "上海御越信息科技有限公司",
      period: "2022.09 – 至今",
      bullets: [
        "搭建企业级 RAG 知识库问答系统，通过检索链路与评估集优化将 FAQ 场景准确率提升至 90%+，幻觉率控制在 5% 以下。",
        "集成 Qwen、DeepSeek、Claude、GPT 多模型 API，设计可复用提示模板、函数调用与工具链路，提升输出稳定性与场景适配能力。",
        "基于 Coze、Dify 落地多 Agent 自动化工作流，覆盖需求分析、内容生成、审核校验与分发跟踪。",
        "构建定价优化（XGBoost + 回归）与需求预测（Prophet / ARIMA）模型，支持库存管理与增长决策。",
      ],
    },
    {
      role: "定价与库存数据分析师",
      company: "Lordco Auto Parts · 温哥华",
      period: "2020.07 – 2022.06",
      bullets: [
        "建立覆盖 30,000+ SKU 的定价分析框架，识别 200 万美元以上利润优化空间。",
        "构建门店 × 品类需求预测模型，支持长尾 SKU 的补货与库存策略优化。",
        "重构 ETL 与报表流程，将报表生成时间从 8 小时缩短至 2 小时。",
      ],
    },
    {
      role: "业务分析师｜客户洞察与售后",
      company: "Mercedes-Benz Canada · 多伦多",
      period: "2017.11 – 2020.06",
      bullets: [
        "构建客户分群与流失预警模型，AUC 达到 0.83，支持精准营销。",
        "分析 50,000+ 客户文本反馈，识别 NPS 关键驱动因素并推动 NPS 提升 6 个百分点。",
      ],
    },
  ],
  en: [
    {
      role: "Founder & AI Data Scientist",
      company: "Shanghai Yuyue Information Technology",
      period: "2022.09 – Present",
      bullets: [
        "Built an enterprise RAG FAQ assistant and improved answer accuracy to 90%+ while keeping hallucination under 5%.",
        "Integrated Qwen, DeepSeek, Claude, and GPT APIs with reusable prompts, function calling, and tool chains.",
        "Delivered multi-agent workflows in Coze and Dify for content and operations automation.",
        "Shipped pricing optimization and demand forecasting models for inventory and growth decisions.",
      ],
    },
    {
      role: "Pricing & Inventory Data Analyst",
      company: "Lordco Auto Parts, Vancouver",
      period: "2020.07 – 2022.06",
      bullets: [
        "Built pricing intelligence across 30,000+ SKUs and identified $2M+ profit opportunity.",
        "Developed forecasting models for store-category planning and long-tail SKU replenishment.",
        "Refactored ETL/reporting pipelines, reducing reporting time from 8 hours to 2 hours.",
      ],
    },
    {
      role: "Business Analyst, Customer Insights & Aftersales",
      company: "Mercedes-Benz Canada, Toronto",
      period: "2017.11 – 2020.06",
      bullets: [
        "Built churn prediction and customer segmentation models with AUC 0.83.",
        "Processed 50,000+ feedback records with NLP topic/sentiment analysis and improved NPS by 6 points.",
      ],
    },
  ],
};
