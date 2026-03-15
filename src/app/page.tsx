import { SiteHeader, PageContainer } from "@/components/layout";
import { Hero, DemoGrid, WorkflowSection, FooterSection } from "@/components/home";

export default function Home() {
  return (
    <main className="min-h-screen page-bg text-gray-900">
      <PageContainer>
        <SiteHeader variant="home" />
        <Hero />
        <DemoGrid />
        <WorkflowSection />
        <FooterSection />
      </PageContainer>
    </main>
  );
}
