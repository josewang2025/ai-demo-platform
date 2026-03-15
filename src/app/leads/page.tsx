import Link from "next/link";
import { SiteHeader, PageContainer } from "@/components/layout";

export default function LeadsPage() {
  return (
    <main className="min-h-screen page-bg text-gray-900">
      <PageContainer size="narrow">
        <SiteHeader variant="back" />
        <header className="mt-10">
          <h1 className="text-3xl font-semibold text-gray-900">
            AI Lead Capture Assistant
          </h1>
          <p className="mt-3 max-w-xl text-base text-gray-600 leading-relaxed">
            Capture leads, tailor responses, and automate follow-up so sales gets qualified opportunities. This demo is in development.
          </p>
        </header>

        <div className="mt-12 card max-w-md mx-auto text-center py-10 px-6">
          <p className="font-semibold text-gray-900">Coming soon</p>
          <p className="mt-2 text-base text-gray-600 leading-relaxed">
            Lead forms, enrichment, and routing will be available here. Explore other demos in the meantime.
          </p>
          <Link href="/" className="mt-6 inline-block btn-secondary py-2.5 px-4">
            Back to demos
          </Link>
        </div>
      </PageContainer>
    </main>
  );
}
