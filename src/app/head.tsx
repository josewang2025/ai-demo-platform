export default function Head() {
  const title = "Joseph Wang | AI Product Builder";
  const description =
    "AI 应用工程师与数据产品顾问官网：简历、服务、案例、Demo。聚焦 LLM、RAG、Agent 自动化与业务落地。";
  const url = "https://www.josephjwang.com";
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </>
  );
}
