import Link from "next/link";

export function CTASection() {
  return (
    <section className="pt-14 pb-20 md:pt-16 md:pb-28">
      <div className="card mx-auto max-w-2xl text-center px-8 py-12 sm:px-12 sm:py-14">
        <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
          Ready to build AI that fits your business?
        </h2>
        <p className="mt-4 text-base text-gray-600 leading-relaxed max-w-md mx-auto">
          We help you go from idea to production—with the right use cases, integration, and scale for your team.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-4">
          <a href="#" className="btn-primary">
            Book a Demo
          </a>
          <Link href="#demos" className="btn-secondary">
            Explore Demos
          </Link>
        </div>
      </div>
    </section>
  );
}
