import type { NextConfig } from "next";
import fs from "node:fs";
import path from "node:path";

// #region agent log
const rootDir = process.cwd();
const buildDiagnostics = {
  twAnimateCssInstalled: fs.existsSync(path.join(rootDir, "node_modules", "tw-animate-css")),
  lucideInstalled: fs.existsSync(path.join(rootDir, "node_modules", "lucide-react")),
  tailwindMergeInstalled: fs.existsSync(path.join(rootDir, "node_modules", "tailwind-merge")),
  homeIndexExists: fs.existsSync(path.join(rootDir, "src/components/home/index.ts")),
  ctaSectionExists: fs.existsSync(path.join(rootDir, "src/components/home/CTASection.tsx")),
  demosModuleExists: fs.existsSync(path.join(rootDir, "src/components/home/demos.ts")),
  uiBarrelExists: fs.existsSync(path.join(rootDir, "src/components/ui/index.ts")),
};
fetch("http://127.0.0.1:7375/ingest/aec10d3d-b467-4b8c-9381-7e0426e69b22", {
  method: "POST",
  headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "2c5c21" },
  body: JSON.stringify({
    sessionId: "2c5c21",
    runId: "pre-fix",
    hypothesisId: "H1-H4",
    location: "next.config.ts:4",
    message: "build dependency and module existence diagnostics",
    data: buildDiagnostics,
    timestamp: Date.now(),
  }),
}).catch(() => {});
// #endregion

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
