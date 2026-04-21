export default function Head() {
  const title = "Services | Joseph Wang";
  const description =
    "AI 咨询与交付服务：原型开发、企业 AI 路线图、数据与增长分析，支持从 PoC 到可运维上线。";
  const url = "https://www.josephjwang.com/services";
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
