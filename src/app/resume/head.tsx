export default function Head() {
  const title = "Resume | Joseph Wang";
  const description =
    "AI 应用工程师与 LLM Engineer 履历：9+ 年数据与自动化经验，覆盖 RAG、Agent、多模型路由、增长分析与落地交付。";
  const url = "https://www.josephjwang.com/resume";
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="profile" />
      <meta property="og:url" content={url} />
      <meta name="twitter:card" content="summary" />
    </>
  );
}
