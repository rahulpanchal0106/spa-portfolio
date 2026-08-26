import type { FlowNode } from "@/lib/projects";

const ICONS: Record<string, string> = {
  lambda: "λ",
  s3: "S3",
  sqs: "Q",
  pdf: "PDF",
  client: "{}",
  pool: "◎",
  route: "⇉",
  llm: "AI",
  ui: "UI",
  worker: "W",
  gpu: "GPU",
  weights: "1B",
  graph: "∴",
  mongo: "DB",
  gemini: "G",
  feed: "∞",
  next: "N",
  ws: "WS",
  kanban: "▣",
  prompt: "?",
  json: "{ }",
  admin: "AD",
  hmac: "⌘",
  bind: "ID",
  gate: "OK",
  rel: "v",
  chunk: "▣",
  sh: "sh",
  pm2: "P2",
  seo: "SEO",
  cta: "→",
  cli: "$",
  node: "JS",
  react: "R",
  scan: "Q",
  build: "B",
  vm: "VM",
  parse: "MD",
  score: "★",
};

export function ArchitectureFlow({ nodes, title }: { nodes: FlowNode[]; title: string }) {
  return (
    <div>
      <p className="mb-1.5 font-mono text-[9px] tracking-[0.16em] text-neutral-500 uppercase">{title}</p>
      <div className="flex min-h-[3.6rem] items-center gap-1 overflow-x-auto">
        {nodes.map((node, i) => (
          <div key={node.id} className="flex items-center gap-1">
            <div className="flex min-w-[3.6rem] flex-col items-center rounded-lg border border-white/10 bg-white/5 px-1 py-1 text-center">
              <span className="mb-0.5 grid h-6 w-6 place-items-center rounded-md bg-[#0a84ff]/20 font-mono text-[8px] font-semibold text-[#64d2ff]">
                {ICONS[node.id] ?? node.label.slice(0, 2)}
              </span>
              <span className="text-[10px] leading-tight font-semibold text-white">{node.label}</span>
              <span className="text-[8px] leading-tight text-neutral-400">{node.caption}</span>
            </div>
            {i < nodes.length - 1 ? (
              <span className="h-px w-4 shrink-0 bg-gradient-to-r from-white/25 to-[#0a84ff]/60" />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
