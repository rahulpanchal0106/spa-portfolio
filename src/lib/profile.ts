export const experience = [
  {
    id: "hiretrack",
    company: "HireTrack",
    role: "Full-Stack Engineer",
    location: "Ahmedabad",
    period: "Present",
    summary:
      "Self-hosted ATS, a vendor license control plane, and an installer that does not compile Next.js on the customer VM.",
    points: [
      "Multi-tenant hiring loop on a custom WebSocket in the same Node process; Kanban paints under 10ms.",
      "License Admin binds HMAC keys to a machine fingerprint and is the only path to a GitHub Release URL.",
      "installer.sh pulls chunked, checksummed tarballs; in-app update is scheduled outside Node so PM2 can stop.",
      "CI packs a runtime-only release in GitHub Actions / ci_prod.sh; a local pymupdf sidecar scores bulk CVs.",
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
      "Selldocs — Razorpay checkout queues a per-buyer flattened watermark so a leak traces to a person.",
      "Foxus AI — session compiler over PaLM / Gemini, 200+ registered users.",
      "free-ai-pool — OpenAI-compatible failover proxy, 2,200+ weekly npm downloads.",
      "React BRAI — Llama 3.2 1B in-tab via WebGPU.",
    ],
  },
] as const;

export const resume = {
  headline: "I build production web systems, realtime tools, and applied AI.",
  blurb:
    "Full-stack engineer in Ahmedabad. HireTrack is a self-hosted ATS with a license control plane and a pre-built installer — customers do not next build on the VM — plus smaller products I shipped end to end.",
  highlights: [
    "Self-hosted ATS with license-gated OTA",
    "Kanban render under 10ms on a live hiring board",
    "2,200+ weekly downloads on free-ai-pool",
    "In-browser LLM inference with WebGPU",
  ],
  lookingFor:
    "Open to full-time full-stack roles (React/Next.js + Node) on production web systems — hiring tools, realtime, and applied AI. Based in Ahmedabad; remote or hybrid in India is fine. Reach him through Mail on this site.",
} as const;
