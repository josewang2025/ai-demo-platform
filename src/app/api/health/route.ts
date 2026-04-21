import { NextResponse } from "next/server";

/**
 * 用于确认线上是否为预期部署（Vercel 会注入 VERCEL_* 环境变量）。
 */
export async function GET() {
  const payload = {
    ok: true as const,
    time: new Date().toISOString(),
    vercelEnv: process.env.VERCEL_ENV ?? null,
    gitCommit: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
    gitBranch: process.env.VERCEL_GIT_COMMIT_REF ?? null,
  };
  return NextResponse.json(payload, {
    headers: {
      "cache-control": "no-store, max-age=0",
    },
  });
}
