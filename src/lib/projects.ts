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
  /** ISO date — project start (Finder “Date Created”). */
  startedAt: string;
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
    startedAt: "2024-06-12",
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
    startedAt: "2024-09-03",
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
    subtitle: "Per-buyer PDF watermark",
    summary:
      "Paid PDF delivery for ARC groups and technical authors. A Razorpay webhook queues work; Lambda stamps a diagonal buyer mark and flattens it so a leak traces to a person — not a DRM reader app.",
    tags: ["Next.js", "Lambda", "SQS", "Razorpay"],
    startedAt: "2024-11-18",
    accent: "sage",
    live: "https://selldocs.store",
    architecture: {
      title: "Checkout → unique PDF",
      nodes: [
        { id: "pay", label: "Razorpay", caption: "Webhook" },
        { id: "sqs", label: "SQS", caption: "Off thread" },
        { id: "lambda", label: "Lambda", caption: "Stamp + flatten" },
        { id: "smtp", label: "SMTP", caption: "Unique file" },
      ],
      challenge:
        "Flattening a PDF on the checkout request would stall Node and strand buyers. App-store DRM also punishes legitimate readers and still fails against a determined copier.",
      approach:
        "Razorpay hits the API, which enqueues buyer + asset on SQS and returns success. Lambda pulls the source from S3, draws a diagonal per-buyer mark, flattens layers so it cannot be peeled, then SMTP sends that unique file.",
      metrics: [
        "Checkout never flattens the PDF",
        "Per-buyer mark, flattened into the file",
        "Razorpay webhook → SQS → Lambda → mail",
      ],
    },
    snippet: {
      file: "lib/pipeline.ts",
      code: `// Razorpay webhook: enqueue, never flatten here
await sqs.sendMessage({
  QueueUrl: WATERMARK_QUEUE,
  MessageBody: JSON.stringify({ assetId, buyerId, email }),
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
    startedAt: "2024-04-22",
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
    startedAt: "2023-08-14",
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
    subtitle: "Self-hosted hiring loop",
    summary:
      "Multi-tenant ATS you run on your own server — jobs, branded career portal, interviews, and a Kanban that paints under 10ms. License Admin and installer.sh sit around it so customers never build from main.",
    tags: ["Next.js", "WebSockets", "MongoDB", "Redux"],
    startedAt: "2024-01-08",
    accent: "sage",
    live: "https://hiretrack.in",
    architecture: {
      title: "ATS ↔ license ↔ VM",
      nodes: [
        { id: "next", label: "ATS", caption: "Self-hosted" },
        { id: "admin", label: "License", caption: "Machine gate" },
        { id: "rel", label: "Releases", caption: "Pre-built" },
        { id: "sh", label: "installer.sh", caption: "Customer VM" },
      ],
      challenge:
        "Teams either drown in spreadsheets or rent an ATS they cannot control. Hosted products lock candidate data, charge per seat, and do not fit air-gapped or on-prem installs.",
      approach:
        "One Next.js app plus a custom WebSocket on the same process (server-ws.cjs, SSE fallback). Orgs get their own portal, roles, and custom fields. A separate license service decides who may pull a CI-built tarball; installer.sh is the only install tool.",
      metrics: [
        "Kanban render under 10ms",
        "Org-scoped WebSocket, no realtime vendor",
        "Self-host: data stays on the customer VM",
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
    subtitle: "Vendor license control plane",
    summary:
      "Super-admin site at admin.hiretrack.in — not an HR tool. A vendor creates a Client, the customer VM registers email + machine fingerprint, and the key is HMAC-bound to that machine. Validate is what authorizes the VM.",
    tags: ["Next.js", "HMAC", "MongoDB"],
    startedAt: "2024-03-20",
    accent: "amber",
    live: "https://admin.hiretrack.in",
    architecture: {
      title: "Entitlement → release URL",
      nodes: [
        { id: "admin", label: "Client", caption: "Must exist first" },
        { id: "hmac", label: "HMAC", caption: "email:machine" },
        { id: "bind", label: "Bind", caption: "One VM" },
        { id: "rel", label: "Release URL", caption: "After validate" },
      ],
      challenge:
        "Emailing a tarball lets a customer copy HireTrack onto every VM they own. Minute-by-minute DRM heartbeats punish legitimate operators and still fail against a copier.",
      approach:
        "A separate Next.js app stores Client and License docs. Register HMAC-signs email:machineCode and rejects a second bind for that email. Validate checks the key is active and bound to that machine, then records installedVersion. On success it can point the installer at a GitHub Release asset — this app never stores the tarball.",
      metrics: [
        "No Client row → no self-register",
        "HMAC key bound to one machine fingerprint",
        "Customers never log into License Admin",
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
    subtitle: "Install without compiling",
    summary:
      "installer.sh is the only customer-facing install tool. After License Admin validates the machine it pulls a CI-built tarball — customers never npm ci && next build on a 1–2 GB VM.",
    tags: ["Bash", "PM2", "SHA-256"],
    startedAt: "2024-05-11",
    accent: "amber",
    architecture: {
      title: "Validate → VM runtime",
      nodes: [
        { id: "gate", label: "Validate", caption: "License URL" },
        { id: "chunk", label: "Chunks", caption: "50MB + SHA-256" },
        { id: "sh", label: "installer.sh", caption: "npm ci --omit=dev" },
        { id: "pm2", label: "PM2", caption: "server-ws.cjs" },
      ],
      challenge:
        "A packed HireTrack build is hundreds of MB. next build on a small VM OOMs, and a single 600 MB GET dies on restrictive networks. An in-app update cannot be a child of Node if it must stop PM2 to free RAM.",
      approach:
        "CI already built. The installer registers email + machine code, prefers 50 MB release parts, concatenates, checks size and SHA-256 plus gzip -t, then production npm ci and PM2. --update uses --schedule-update; --rollback restores previousVersion.",
      metrics: [
        "No next build on the customer VM",
        "Chunked download with SHA-256 + gzip -t",
        "Update scheduled outside the Node process",
      ],
    },
    snippet: {
      file: "installer.sh",
      code: `./installer.sh --install
# license validate → 50MB parts → sha256 + gzip -t
# then npm ci --omit=dev && pm2 start server-ws.cjs
# --update uses --schedule-update (not a child of Node)`,
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
    startedAt: "2024-07-02",
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
    startedAt: "2025-01-15",
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
    subtitle: "Build once, publish",
    summary:
      "Producer side of HireTrack: GitLab Sonar gate, then GitHub Actions or ci_prod.sh packs a runtime-only tarball (no git tree, no node_modules) and publishes full archive + 50 MB parts + SHA-256 manifest. main is not an installable build.",
    tags: ["GitLab CI", "Actions", "Sonar"],
    startedAt: "2024-02-28",
    accent: "amber",
    architecture: {
      title: "Scan → pack → Release",
      nodes: [
        { id: "scan", label: "Sonar", caption: "GitLab gate" },
        { id: "build", label: "next build", caption: "In CI, not VM" },
        { id: "pack", label: "Pack", caption: "Runtime only" },
        { id: "rel", label: "Release", caption: "Chunks + SHA-256" },
      ],
      challenge:
        "Telling every customer to npm ci and next build on a 1–2 GB VM fails on memory and time. Source on main is also not a shippable artifact.",
      approach:
        "Build once with a raised Node heap, drop .next/cache, tar runtime files only, split into 50 MB parts, write a SHA-256 manifest, upload to GitHub Releases. ci_prod.sh bumps version from the last commit subject; the Actions workflow tags vX.Y.Z.",
      metrics: [
        "Sonar quality gate before pack",
        "Runtime tarball — installer runs npm ci",
        "Release = full archive + parts + manifest",
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
      "Bulk CV ingest for the ATS: Tesseract on scans, a local pymupdf4llm sidecar to markdown, then Gemini scores skills, experience, affordability, and overall into HireTrack’s candidate schema.",
    tags: ["PyMuPDF", "FastAPI", "Gemini"],
    startedAt: "2024-10-09",
    accent: "sage",
    architecture: {
      title: "Parse → score loop",
      nodes: [
        { id: "pdf", label: "PDF", caption: "Bulk CVs" },
        { id: "parse", label: "pymupdf4llm", caption: "Markdown" },
        { id: "gemini", label: "Gemini", caption: "Extract" },
        { id: "score", label: "Score", caption: "Four axes" },
      ],
      challenge:
        "Recruiters dump folders of CVs. Cloud parsers were expensive, flaky on scanned PDFs, and did not land in HireTrack’s candidate schema.",
      approach:
        "Scanned PDFs go through Tesseract. A local FastAPI sidecar (md-parse.sh) runs pymupdf4llm, then Gemini maps markdown into scored candidate records for batch ingest. This is an ATS feature, not a separate product.",
      metrics: [
        "Local PDF→markdown sidecar",
        "Tesseract for scanned CVs",
        "Gemini: skills, experience, affordability, overall",
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
