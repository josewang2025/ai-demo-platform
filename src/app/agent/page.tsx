import { SiteHeader, PageContainer } from "@/components/layout";
import { AgentChat } from "@/components/agent/AgentChat";

export default function AgentPage() {
  return (
    <main className="min-h-screen page-bg text-gray-900">
      <PageContainer size="narrow">
        <SiteHeader variant="back" />
        <header className="mt-10">
          <h1 className="text-3xl font-semibold text-gray-900">
            AI Support Agent
          </h1>
          <p className="mt-3 max-w-xl text-base text-gray-600 leading-relaxed">
            Handle common questions instantly and hand off to your team when needed. Try the prompts below or ask your own. In production, this connects to your backend for live, accurate responses.
          </p>
        </header>
        <div className="mt-10">
          <AgentChat />
        </div>
      </PageContainer>
    </main>
  );
}
