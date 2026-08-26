export const experience = [
  {
    id: "hiretrack",
    company: "HireTrack",
    role: "Full-Stack Engineer",
    location: "Ahmedabad",
    period: "Present",
    summary:
      "Production B2B hiring OS: the ATS, license control plane, on-prem installer, and the pipelines that ship it.",
    points: [
      "Custom WebSockets, schema-driven fields, and a Kanban that paints under 10ms.",
      "License admin at admin.hiretrack.in — HMAC keys, machine binding, revoke/renew.",
      "installer.sh + chunked GitHub Releases for customer VMs, PM2 in-place upgrades.",
      "GitLab CI / GitHub Actions, Sonar gates, and a local PyMuPDF4LLM sidecar for bulk CVs.",
    ],
  },
  {
    id: "independent",
    company: "Independent",
    role: "Product & open source",
    location: "Ahmedabad",
    period: "Ongoing",
    summary: "Shipped paid tools, a tutor product, and an npm library people actually install.",
    points: [
      "Selldocs — per-buyer PDF watermarking on Lambda + S3 + SQS.",
      "Foxus AI — session compiler over PaLM / Gemini, 200+ registered users.",
      "free-ai-pool — OpenAI-compatible failover proxy, 2,200+ weekly npm downloads.",
      "React BRAI — Llama 3.2 1B in-tab via WebGPU.",
    ],
  },
] as const;

export const resume = {
  headline: "I build production web systems, realtime tools, and applied AI.",
  blurb:
    "Full-stack engineer in Ahmedabad. Most of my recent work is HireTrack — a multi-tenant ATS with its own license server, OTA installer, and CI — plus smaller products I shipped end to end.",
  highlights: [
    "Kanban render under 10ms on a live hiring board",
    "On-prem licensing + OTA for customer VMs",
    "2,200+ weekly downloads on free-ai-pool",
    "In-browser LLM inference with WebGPU",
  ],
} as const;
