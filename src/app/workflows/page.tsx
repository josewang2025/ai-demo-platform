import Link from "next/link";
import { SiteHeader, PageContainer } from "@/components/layout";
import { WorkflowStep } from "@/components/ui";

const STEPS = [
  { title: "Input Data", description: "Your data enters from existing tools—orders, leads, or tickets." },
  { title: "Processing", description: "Data is cleaned and structured so AI can use it reliably." },
  { title: "AI Analysis", description: "AI finds patterns, opportunities, and recommended next steps." },
  { title: "Recommended Actions", description: "You see clear options; approve or adjust before anything runs." },
  { title: "Automation", description: "Approved actions run automatically—no manual handoffs." },
];

export default function WorkflowsPage() {
  return (
    <main className="min-h-screen page-bg text-gray-900">
      <PageContainer size="narrow">
        <SiteHeader variant="back" />
        <header className="mt-10">
          <h1 className="text-3xl font-semibold text-gray-900">
            AI Workflow Showcase
          </h1>
          <p className="mt-3 max-w-xl text-base text-gray-600 leading-relaxed">
            See how data flows from your systems through AI and into automated actions. One pipeline, with you in control. Full workflow builder coming soon.
          </p>
        </header>

        <div className="mt-10 overflow-x-auto pb-4">
          <div className="flex min-w-max flex-wrap items-stretch justify-center gap-6 md:gap-8">
            {STEPS.map((step, i) => (
              <div key={step.title} className="flex items-center gap-4 md:gap-6">
                <WorkflowStep step={i + 1} title={step.title} description={step.description} />
                {i < STEPS.length - 1 && (
                  <span className="hidden shrink-0 text-gray-300 md:inline md:text-xl" aria-hidden>→</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 card max-w-md mx-auto text-center py-10 px-6">
          <p className="font-semibold text-gray-900">Coming soon</p>
          <p className="mt-2 text-base text-gray-600 leading-relaxed">
            A full workflow builder and automation demo will be available here. Until then, explore the other demos.
          </p>
          <Link href="/" className="mt-6 inline-block btn-secondary py-2.5 px-4">
            Back to demos
          </Link>
        </div>
      </PageContainer>
    </main>
  );
}
