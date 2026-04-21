import { NextResponse } from "next/server";

const USERNAME = "jiuliangwang";

type GithubRepo = {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  topics?: string[];
};

export async function GET() {
  try {
    const res = await fetch(`https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=6`, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json({ repos: [] }, { status: 200 });
    }

    const data = (await res.json()) as GithubRepo[];
    const repos = data
      .filter((repo) => !repo.name.startsWith("."))
      .slice(0, 6)
      .map((repo) => ({
        name: repo.name,
        desc: repo.description ?? "No description provided.",
        url: repo.html_url,
        tags: [repo.language ?? "Code", ...(repo.topics?.slice(0, 2) ?? [])].filter(Boolean),
      }));

    return NextResponse.json({ repos });
  } catch {
    return NextResponse.json({ repos: [] }, { status: 200 });
  }
}
