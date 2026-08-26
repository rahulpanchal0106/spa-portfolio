export type FlowNode = {
  id: string;
  label: string;
  caption: string;
};

export type Project = {
  id: string;
  name: string;
  shortName: string;
  subtitle: string;
  summary: string;
  tags: string[];
  accent: "sage" | "amber" | "sky";
  live?: string;
  repo?: string;
  architecture: {
    title: string;
    nodes: FlowNode[];
    challenge: string;
    approach: string;
    metrics: string[];
  };
  snippet: {
    file: string;
    code: string;
  };
  teaserLabel: string;
};

export const projects: Project[] = [
  {
    id: "free-ai-pool",
    name: "Free AI Pool",
    shortName: "AI Pool",
    subtitle: "OpenAI-compatible LLM proxy",
    summary:
      "npm-published load balancer and failover proxy with API key management. 2,200+ weekly downloads.",
    tags: ["Node.js", "TypeScript", "LLM"],
    accent: "amber",
    live: "https://www.npmjs.com/package/free-ai-pool",
    repo: "https://github.com/rahulpanchal0106",
    architecture: {
      title: "Provider failover fabric",
      nodes: [
        { id: "client", label: "App", caption: "OpenAI SDK" },
        { id: "pool", label: "Pool", caption: "Key + quota" },
        { id: "route", label: "Router", caption: "Health checks" },
        { id: "llm", label: "Providers", caption: "Failover" },
      ],
      challenge:
        "Teams needed a drop-in OpenAI-compatible endpoint that could rotate keys and survive a single-provider outage without rewriting clients.",
      approach:
        "A thin proxy with the familiar /v1/chat/completions surface, pooled keys, and automatic failover so existing SDKs keep working.",
      metrics: [
        "2,200+ weekly npm downloads",
        "OpenAI-compatible request surface",
        "Key pool + provider failover",
      ],
    },
    snippet: {
      file: "src/router.ts",
      code: `export async function routeChat(req: ChatRequest) {
  for (const provider of healthyProviders()) {
    try {
      return await provider.chat(req);
    } catch {
      markUnhealthy(provider.id);
    }
  }
  throw new Error("No healthy LLM providers");
}`,
    },
    teaserLabel: "HOVER: free-ai-pool routing teaser",
  },
  {
    id: "react-brai",
    name: "React BRAI",
    shortName: "BRAI",
    subtitle: "Client-side WebGPU inference",
    summary:
      "Edge AI in the browser — Llama 3.2 1B via WebGPU, with multi-tab model coordination.",
    tags: ["React", "WebGPU", "Workers"],
    accent: "amber",
    live: "https://react-brai.vercel.app",
    architecture: {
      title: "In-browser inference graph",
      nodes: [
        { id: "ui", label: "React", caption: "UI thread" },
        { id: "worker", label: "Worker", caption: "Model host" },
        { id: "gpu", label: "WebGPU", caption: "Kernels" },
        { id: "weights", label: "Llama 3.2", caption: "1B weights" },
      ],
      challenge:
        "Running a real LLM in-tab without a GPU server, while keeping the UI responsive and avoiding duplicate model loads across tabs.",
      approach:
        "WebGPU kernels on a worker thread, plus multi-tab coordination so one loaded model can serve sibling sessions.",
      metrics: [
        "Llama 3.2 1B in-browser",
        "UI thread stays interactive",
        "Shared model across tabs",
      ],
    },
    snippet: {
      file: "src/gpu.ts",
      code: `const adapter = await navigator.gpu.requestAdapter();
if (!adapter) throw new Error("WebGPU unavailable");
const device = await adapter.requestDevice();
const encoder = device.createCommandEncoder();
pass.encodeInference(encoder, tokens);
device.queue.submit([encoder.finish()]);`,
    },
    teaserLabel: "HOVER: React BRAI WebGPU AI teaser",
  },
  {
    id: "selldocs",
    name: "Selldocs",
    shortName: "Selldocs",
    subtitle: "PDF DRM & watermarking",
    summary:
      "Author ARC / paid PDF protection. Async Lambda + S3 + SQS pipeline watermarks and flattens without blocking checkout.",
    tags: ["Next.js", "Lambda", "S3", "SQS"],
    accent: "sage",
    live: "https://selldocs.vercel.app",
    architecture: {
      title: "PDF engine system architecture",
      nodes: [
        { id: "lambda", label: "AWS Lambda", caption: "Job worker" },
        { id: "s3", label: "S3 Bucket", caption: "Source + out" },
        { id: "sqs", label: "SQS Pipeline", caption: "Async queue" },
        { id: "pdf", label: "PDF Engine", caption: "Watermark" },
      ],
      challenge:
        "Heavy PDFs cannot be watermarked and flattened on the request thread — checkout would stall, and Lambda timeouts would strand buyers.",
      approach:
        "Checkout writes the original to S3, enqueues an SQS job, and Lambda stamps a per-buyer watermark then flattens the file for download.",
      metrics: [
        "UI thread never blocked on flatten",
        "Per-buyer DRM watermark",
        "Razorpay-paid delivery path",
      ],
    },
    snippet: {
      file: "lib/pipeline.ts",
      code: `await s3.putObject({ Bucket, Key: rawKey, Body: pdf });
await sqs.sendMessage({
  QueueUrl: WATERMARK_QUEUE,
  MessageBody: JSON.stringify({ rawKey, buyerId, email }),
});
return { status: "queued" };`,
    },
    teaserLabel: "HOVER: Selldocs watermark pipeline",
  },
  {
    id: "socio",
    name: "Socio",
    shortName: "Socio",
    subtitle: "AI social recommendations",
    summary:
      "Personalized feeds and AI-assisted discovery — a compact social surface with Gemini-backed ranking.",
    tags: ["React", "Node", "MongoDB", "Gemini"],
    accent: "sky",
    live: "https://socio-alpha.vercel.app",
    architecture: {
      title: "Feed ranking loop",
      nodes: [
        { id: "graph", label: "Graph", caption: "Follows" },
        { id: "mongo", label: "MongoDB", caption: "Posts" },
        { id: "gemini", label: "Gemini", caption: "Rank + recs" },
        { id: "feed", label: "Feed", caption: "Personalized" },
      ],
      challenge:
        "A chronological feed goes cold quickly. Recommendations had to feel personal without a heavyweight ML cluster.",
      approach:
        "Gemini ranks candidate posts against a compact user profile, mixed with graph proximity so the feed stays social — not generic.",
      metrics: [
        "Gemini-backed recommendations",
        "Personalized home feed",
        "MongoDB social graph",
      ],
    },
    snippet: {
      file: "server/feed.ts",
      code: `const candidates = await posts.nearby(user.id, 80);
const ranked = await gemini.rank({
  profile: user.interests,
  posts: candidates,
});
return ranked.slice(0, 20);`,
    },
    teaserLabel: "HOVER: Socio feed ranking teaser",
  },
  {
    id: "foxus-ai",
    name: "Foxus AI",
    shortName: "Foxus",
    subtitle: "Personalized AI tutor",
    summary:
      "Focused learning sessions with a custom text-to-JSON layer over PaLM / Gemini. 200+ registered users.",
    tags: ["React", "Node", "Gemini"],
    accent: "sky",
    live: "https://foxus-ai.onrender.com",
    architecture: {
      title: "Session compiler",
      nodes: [
        { id: "prompt", label: "Prompt", caption: "Topic + level" },
        { id: "llm", label: "PaLM / Gemini", caption: "Raw text" },
        { id: "json", label: "Text→JSON", caption: "Compiler" },
        { id: "ui", label: "Session UI", caption: "Chapters" },
      ],
      challenge:
        "Model output was prose. The UI needed chapters, quizzes, and difficulty — structured data the model would not reliably emit.",
      approach:
        "A custom text-to-JSON compiler that turns tutor responses into session trees the frontend can render and resume.",
      metrics: [
        "200+ registered users",
        "Custom text-to-JSON compiler",
        "Indexed on Google Search",
      ],
    },
    snippet: {
      file: "lib/session.ts",
      code: `const raw = await palm.generate(topic, level);
const session = compileTutorText(raw);
return {
  chapters: session.chapters,
  quiz: session.quiz,
};`,
    },
    teaserLabel: "HOVER: Foxus session compiler",
  },
  {
    id: "hiretrack",
    name: "HireTrack ATS",
    shortName: "HireTrack",
    subtitle: "Realtime hiring OS",
    summary:
      "Production B2B ATS: custom WebSockets, schema-driven custom fields, and a Kanban that paints under 10ms.",
    tags: ["Next.js", "WebSockets", "MongoDB"],
    accent: "sage",
    live: "https://hiretrack.in",
    architecture: {
      title: "Realtime tenant fabric",
      nodes: [
        { id: "next", label: "Next.js", caption: "App shell" },
        { id: "ws", label: "WebSocket", caption: "Custom bus" },
        { id: "mongo", label: "MongoDB", caption: "Tenants" },
        { id: "kanban", label: "Kanban", caption: "<10ms" },
      ],
      challenge:
        "Recruiters live on the pipeline board. Default list renders were too slow, and off-the-shelf realtime tools did not fit on-prem installs.",
      approach:
        "A custom WebSocket layer, virtualized Kanban, and schema-driven custom fields so each tenant can extend jobs and candidates without a migration.",
      metrics: [
        "Kanban render under 10ms",
        "20+ core hiring features",
        "Schema-driven custom fields",
      ],
    },
    snippet: {
      file: "lib/kanban.ts",
      code: `const virtualizer = useVirtualizer({
  count: cards.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 72,
});
// measured p95 paint: < 10ms`,
    },
    teaserLabel: "HOVER: HireTrack kanban teaser",
  },
  {
    id: "ht-license",
    name: "HT License Server",
    shortName: "License",
    subtitle: "On-prem license admin",
    summary:
      "Commercial license console at admin.hiretrack.in — HMAC keys, machine binding, revoke/renew, version gates for customer VMs.",
    tags: ["Next.js", "JWT", "MongoDB"],
    accent: "amber",
    live: "https://admin.hiretrack.in",
    architecture: {
      title: "License control plane",
      nodes: [
        { id: "admin", label: "Admin", caption: "Clients" },
        { id: "hmac", label: "HMAC", caption: "Key mint" },
        { id: "bind", label: "Machine", caption: "Hardware bind" },
        { id: "gate", label: "Validate", caption: "OTA gate" },
      ],
      challenge:
        "On-prem ATS installs still needed a way to issue, bind, and revoke seats without putting the whole product behind a SaaS login.",
      approach:
        "A separate admin app mints HMAC license keys, binds them to a machine id, and exposes validate/revoke APIs the installer and the ATS call on boot.",
      metrics: [
        "Machine-bound license keys",
        "Revoke / renew without redeploy",
        "Version-aware validation",
      ],
    },
    snippet: {
      file: "lib/license.ts",
      code: `const hmac = createHmac("sha256", secret);
hmac.update(email + ":" + machineCode);
return hmac.digest("hex").slice(0, 32)
  .toUpperCase().match(/.{1,4}/g)!.join("-");`,
    },
    teaserLabel: "HOVER: license key mint teaser",
  },
  {
    id: "ht-ota",
    name: "HT OTA Installer",
    shortName: "OTA",
    subtitle: "On-prem install & update",
    summary:
      "installer.sh for customer VMs: GitHub Releases, chunked tarball downloads, machine-id, PM2, and in-place upgrades.",
    tags: ["Bash", "PM2", "Releases"],
    accent: "amber",
    architecture: {
      title: "Release → VM path",
      nodes: [
        { id: "rel", label: "Release", caption: "GitHub assets" },
        { id: "chunk", label: "Chunks", caption: "50MB parts" },
        { id: "sh", label: "installer.sh", caption: "VM bootstrap" },
        { id: "pm2", label: "PM2", caption: "Process" },
      ],
      challenge:
        "Customer networks often dropped a single large tarball, and upgrades had to land on an already-licensed machine without a full reinstall.",
      approach:
        "A bash installer that prefers split release assets, verifies the machine id against the license server, then restarts PM2 in place.",
      metrics: [
        "Chunked GitHub Release downloads",
        "Machine-id bound upgrades",
        "Interactive + CI-quiet modes",
      ],
    },
    snippet: {
      file: "installer.sh",
      code: `./installer.sh --install
# prefers hiretrack-vX.Y.Z.tar.gz parts
# from GitHub Releases, then:
pm2 restart hiretrack --update-env`,
    },
    teaserLabel: "HOVER: OTA install teaser",
  },
  {
    id: "ht-landing",
    name: "HT Landing",
    shortName: "Landing",
    subtitle: "hiretrack.in marketing",
    summary:
      "SEO-first Next.js marketing site for HireTrack — sitemap, metadata, and a career-portal story separate from the ATS app.",
    tags: ["Next.js", "SEO", "Tailwind"],
    accent: "sky",
    live: "https://hiretrack.in",
    architecture: {
      title: "Marketing surface",
      nodes: [
        { id: "next", label: "Next.js", caption: "App Router" },
        { id: "seo", label: "SEO", caption: "Sitemap" },
        { id: "ui", label: "UI", caption: "Landing" },
        { id: "cta", label: "CTA", caption: "Demo / app" },
      ],
      challenge:
        "The ATS is a signed-in product. Search and first-touch needed a public site that did not ship dashboard JS to crawlers.",
      approach:
        "A dedicated App Router marketing repo with metadata, sitemap, and robots — linking into the app and demo without coupling deploy cycles.",
      metrics: [
        "Separate deploy from the ATS",
        "Metadata + sitemap + robots",
        "Public hiretrack.in surface",
      ],
    },
    snippet: {
      file: "app/sitemap.ts",
      code: `export default function sitemap() {
  return [
    { url: "https://hiretrack.in", changeFrequency: "weekly" },
    { url: "https://hiretrack.in/features", changeFrequency: "monthly" },
  ];
}`,
    },
    teaserLabel: "HOVER: landing page teaser",
  },
  {
    id: "presence-sync",
    name: "Presence Sync",
    shortName: "Presence",
    subtitle: "Live cursor engine",
    summary:
      "Self-hosted presence: @presence-sync/node, React bindings, and a CLI — attach to an existing HTTP server or run a dedicated live port.",
    tags: ["TypeScript", "WebSockets", "React"],
    accent: "sky",
    architecture: {
      title: "Cursor fabric",
      nodes: [
        { id: "cli", label: "CLI", caption: "Scaffold" },
        { id: "node", label: "Node", caption: "Engine" },
        { id: "ws", label: "Socket", caption: "Live path" },
        { id: "react", label: "React", caption: "Cursors" },
      ],
      challenge:
        "Collaborative UIs needed live cursors without standing up a third-party presence SaaS or rewriting the existing socket layer.",
      approach:
        "A small engine you can attach() to an HTTP server, listen() as a process, or feed raw messages through createCursorEngine — plus React bindings.",
      metrics: [
        "attach / listen / engine modes",
        "Typed Node + React packages",
        "Self-hosted, no vendor lock",
      ],
    },
    snippet: {
      file: "packages/node/src/index.ts",
      code: `const presence = new LivePresence();
presence.attach(server, { path: "/live" });
// or: await presence.listen({ port: 3001 });`,
    },
    teaserLabel: "HOVER: presence cursors teaser",
  },
  {
    id: "ht-ci",
    name: "HT Release CI",
    shortName: "CI/CD",
    subtitle: "Scan, build, ship",
    summary:
      "GitLab CI + GitHub Actions for HireTrack: Sonar scan, Node 20 build, GitHub Releases, and ci_prod.sh / ci_dev.sh droplet scripts.",
    tags: ["GitLab CI", "Actions", "Sonar"],
    accent: "amber",
    architecture: {
      title: "Ship pipeline",
      nodes: [
        { id: "scan", label: "Sonar", caption: "Quality gate" },
        { id: "build", label: "Build", caption: "Node 20" },
        { id: "rel", label: "Release", caption: "Assets" },
        { id: "vm", label: "Droplet", caption: "ci_prod.sh" },
      ],
      challenge:
        "On-prem releases needed a tagged tarball, quality gate, and a scripted VM path — not a manual copy onto a droplet.",
      approach:
        "GitLab stages for scan/build/release, GitHub Actions to cut versioned assets, and bash helpers (ci_prod.sh, ci_dev.sh) for the VM.",
      metrics: [
        "Sonar quality gate on main",
        "Versioned GitHub Releases",
        "Prod/dev droplet scripts",
      ],
    },
    snippet: {
      file: ".gitlab-ci.yml",
      code: `stages:
  - scan
  - build
  - release
sonarcloud-check:
  stage: scan
  script: [sonar-scanner]
  only: [main, merge_requests]`,
    },
    teaserLabel: "HOVER: CI pipeline teaser",
  },
  {
    id: "ht-resume-ai",
    name: "HT Resume AI",
    shortName: "CV AI",
    subtitle: "Bulk CV → structured hire",
    summary:
      "Local PyMuPDF4LLM service turns PDFs into markdown; Gemini scores skills, experience, and fit for batch candidate ingest.",
    tags: ["PyMuPDF", "FastAPI", "Gemini"],
    accent: "sage",
    architecture: {
      title: "Parse → score loop",
      nodes: [
        { id: "pdf", label: "PDF", caption: "Bulk CVs" },
        { id: "parse", label: "pymupdf4llm", caption: "Markdown" },
        { id: "gemini", label: "Gemini", caption: "Extract" },
        { id: "score", label: "Score", caption: "Skills / fit" },
      ],
      challenge:
        "Recruiters dump folders of CVs. Cloud parsers were expensive, flaky on scanned PDFs, and did not land in HireTrack’s candidate schema.",
      approach:
        "A local FastAPI sidecar (md-parse.sh) runs pymupdf4llm, then Gemini maps markdown into scored candidate records for bulk ingest.",
      metrics: [
        "Local PDF→markdown sidecar",
        "Batch CV ingest into ATS",
        "Multi-axis Gemini scoring",
      ],
    },
    snippet: {
      file: "md-parse.sh",
      code: `markdown_text = pymupdf4llm.to_markdown(temp_path)
# FastAPI sidecar on DOCLING_PARSE_URL
# ATS maps markdown → candidate schema`,
    },
    teaserLabel: "HOVER: resume parse teaser",
  },
];

export const flagshipIds = ["selldocs", "hiretrack", "foxus-ai"] as const;

export function projectById(id: string) {
  return projects.find((p) => p.id === id);
}

export const flagships = flagshipIds.map((id) => {
  const project = projectById(id);
  if (!project) throw new Error(`Missing flagship ${id}`);
  return project;
});
