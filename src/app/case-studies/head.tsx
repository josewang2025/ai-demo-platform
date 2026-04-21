export default function Head() {
  const title = "Case Studies | Joseph Wang";
  const description =
    "业务案例与 Demo 展示：数据分析、电商洞察、研究助手与工作流自动化实践，持续迭代更新。";
  const url = "https://www.josephjwang.com/case-studies";
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta name="twitter:card" content="summary" />
    </>
  );
}
