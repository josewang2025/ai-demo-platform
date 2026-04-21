export default function Head() {
  const title = "Contact | Joseph Wang";
  const description =
    "联系 Joseph Wang：AI 产品咨询、LLM 应用开发、Agent 自动化与数据分析合作。";
  const url = "https://www.josephjwang.com/contact";
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
