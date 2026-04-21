"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SectionHeader } from "@/components/ui";

type Repo = {
  name: string;
  desc: string;
  tags: string[];
  url: string;
};

const FALLBACK_REPOS: Repo[] = [
  {
    name: "ai-data-analyst-demo",
    desc: "AI analytics assistant with dataset profiling, signals, and executive reports.",
    tags: ["Next.js", "LLM", "Analytics"],
    url: "https://github.com/",
  },
  {
    name: "agent-workflow-playbook",
    desc: "Reusable workflow patterns for multi-agent content and operations automation.",
    tags: ["Dify", "n8n", "Agent"],
    url: "https://github.com/",
  },
  {
    name: "rag-knowledge-assistant",
    desc: "Hybrid retrieval (vector + keyword) FAQ assistant with evaluation-driven tuning.",
    tags: ["RAG", "Python", "Evaluation"],
    url: "https://github.com/",
  },
];

export function FeaturedReposPreview() {
  const { locale } = useLanguage();
  const [repos, setRepos] = useState<Repo[]>(FALLBACK_REPOS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch("/api/github/repos");
        const data = (await res.json()) as { repos?: Repo[] };
        if (!active) return;
        if (Array.isArray(data.repos) && data.repos.length > 0) {
          setRepos(data.repos);
        }
      } catch {
        // keep fallback repos
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const description = useMemo(() => {
    if (locale === "zh") {
      return loading
        ? "正在加载 GitHub 项目…（加载失败将自动显示本地案例）"
        : "已连接 GitHub 项目列表；如 API 不可用将自动回退到本地案例。";
    }
    return loading
      ? "Loading GitHub repositories... (will fallback to local cards if unavailable)"
      : "Connected to live GitHub repositories with automatic local fallback.";
  }, [locale, loading]);

  return (
    <section className="pt-16 pb-20 md:pt-20 md:pb-24">
      <SectionHeader
        title={locale === "zh" ? "GitHub 案例预览" : "Featured GitHub Repositories"}
        description={description}
      />
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {repos.map((repo) => (
          <article key={repo.name} className="card flex flex-col">
            <h3 className="text-base font-semibold text-gray-900">{repo.name}</h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600">{repo.desc}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {repo.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700">
                  {tag}
                </span>
              ))}
            </div>
            <a href={repo.url} target="_blank" rel="noreferrer" className="mt-6 inline-block text-sm font-medium text-gray-900 hover:text-gray-700">
              {locale === "zh" ? "查看代码" : "View repository"} →
            </a>
          </article>
        ))}
      </div>
      <div className="mt-6">
        <Link href="/case-studies" className="btn-secondary py-2.5 px-4">
          {locale === "zh" ? "查看全部案例" : "View all case studies"}
        </Link>
      </div>
    </section>
  );
}
