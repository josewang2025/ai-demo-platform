import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ContactPage() {
  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-semibold text-white">联系</h1>
      <p className="mt-4 text-slate-300">
        欢迎交流 AI 产品、增长分析、数据系统建设与跨境业务合作。
      </p>
      <div className="mt-8">
        <Link
          href="mailto:hello@josephjwang.com"
          className={cn(
            buttonVariants({ variant: "default" }),
            "bg-cyan-500 text-slate-950 hover:bg-cyan-400"
          )}
        >
          发送邮件
        </Link>
      </div>
    </section>
  );
}
