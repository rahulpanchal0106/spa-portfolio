import type { Project } from "@/lib/projects";

function PlayMark() {
  return (
    <span className="absolute inset-0 grid place-items-center">
      <span className="grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-black/35 text-white shadow-lg backdrop-blur-sm">
        <svg viewBox="0 0 20 20" className="ml-0.5 h-4 w-4 fill-current" aria-hidden>
          <path d="M6.5 4.8v10.4L16 10 6.5 4.8Z" />
        </svg>
      </span>
    </span>
  );
}

function FreeAiTeaser() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#121820] p-2">
      <div className="flex h-full items-center justify-between gap-1 font-mono text-[8px] text-amber-400/90">
        {["App", "Pool", "A", "B"].map((label, i) => (
          <div key={label} className="flex flex-1 flex-col items-center gap-1">
            <span
              className="teaser-run h-6 w-6 rounded-full border border-amber-500/40 bg-amber-500/15"
              style={{ animation: `pulse-node 1.6s ${i * 0.18}s ease-in-out infinite` }}
            />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

function BraiTeaser() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#14120e]">
      <div className="grid h-full grid-cols-6 grid-rows-4 gap-1 p-2">
        {Array.from({ length: 24 }, (_, i) => (
          <span
            key={i}
            className="teaser-run rounded-[3px] bg-amber-500/70"
            style={{
              animation: `pulse-node 1.4s ${((i * 17) % 11) * 0.08}s ease-in-out infinite`,
              opacity: 0.4,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function SelldocsTeaser() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#12160f] p-2">
      <div className="relative mx-auto h-full w-[70%] rounded-sm bg-[#f4efe6] shadow-md">
        <div className="space-y-1 p-2">
          <div className="h-1 w-4/5 rounded bg-[#0f141c]/20" />
          <div className="h-1 w-full rounded bg-[#0f141c]/12" />
          <div className="h-1 w-3/5 rounded bg-[#0f141c]/12" />
        </div>
        <span
          className="teaser-run absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded border-2 border-amber-400/80 px-1.5 py-0.5 font-mono text-[8px] font-bold tracking-wider text-amber-400 uppercase"
          style={{ animation: "stamp 2.8s ease-in-out infinite" }}
        >
          Buyer
        </span>
      </div>
    </div>
  );
}

function SocioTeaser() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#10151c] p-2">
      <div className="teaser-run space-y-1.5" style={{ animation: "feed-shift 3.4s ease-in-out infinite" }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex gap-1.5 rounded-md border border-white/10 bg-white/5 p-1.5">
            <span className="h-5 w-5 rounded-full bg-amber-500/40" />
            <div className="flex-1 space-y-1">
              <div className="h-1 w-2/3 rounded bg-white/30" />
              <div className="h-1 w-full rounded bg-white/15" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HireTrackTeaser() {
  return (
    <div className="relative grid h-full w-full grid-cols-3 gap-1 overflow-hidden bg-[#10140f] p-2">
      {["Inbox", "Talk", "Offer"].map((col, ci) => (
        <div key={col} className="rounded bg-white/5 p-1">
          <div className="mb-1 font-mono text-[7px] tracking-wide text-amber-400/80 uppercase">{col}</div>
          <div className="relative h-10">
            <div className="h-4 rounded bg-white/10" />
            {ci === 0 ? (
              <div
                className="teaser-run absolute top-0 h-4 w-full rounded bg-amber-500/50"
                style={{ animation: "kanban-slide 2.6s ease-in-out infinite" }}
              />
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

function LicenseTeaser() {
  return (
    <div className="relative grid h-full w-full place-items-center overflow-hidden bg-[#16120c] p-1.5">
      <div
        className="teaser-run rounded border border-amber-400/70 px-1.5 py-0.5 font-mono text-[7px] tracking-widest text-amber-300"
        style={{ animation: "pulse-node 1.8s ease-in-out infinite" }}
      >
        A9F2-11C0
      </div>
    </div>
  );
}

function OtaTeaser() {
  return (
    <div className="relative flex h-full w-full flex-col justify-center gap-1 overflow-hidden bg-[#12140f] p-2">
      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className="teaser-run h-full w-2/3 rounded-full bg-amber-400" style={{ animation: "pulse-node 1.6s ease-in-out infinite" }} />
      </div>
      <span className="font-mono text-[7px] text-amber-300/80">v1.1.9.tar.gz</span>
    </div>
  );
}

function LandingTeaser() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#10141c] p-1.5">
      <div className="h-full rounded-sm border border-white/15 bg-white/5">
        <div className="flex h-2.5 items-center gap-0.5 border-b border-white/10 px-1">
          <span className="h-1 w-1 rounded-full bg-amber-400/80" />
          <span className="h-1 w-1 rounded-full bg-white/30" />
        </div>
        <div className="space-y-1 p-1.5">
          <div className="h-1 w-3/5 rounded bg-amber-400/50" />
          <div className="h-1 w-full rounded bg-white/15" />
        </div>
      </div>
    </div>
  );
}

function PresenceTeaser() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#10151c]">
      {[
        { x: "18%", y: "28%", delay: "0s" },
        { x: "62%", y: "42%", delay: "0.35s" },
        { x: "40%", y: "64%", delay: "0.7s" },
      ].map((dot) => (
        <span
          key={dot.x}
          className="teaser-run absolute h-2 w-2 rounded-full bg-amber-400"
          style={{ left: dot.x, top: dot.y, animation: `pulse-node 1.5s ${dot.delay} ease-in-out infinite` }}
        />
      ))}
    </div>
  );
}

function CiTeaser() {
  return (
    <div className="relative flex h-full w-full items-center justify-center gap-1 overflow-hidden bg-[#121820] p-1.5">
      {["Q", "B", "R"].map((stage, i) => (
        <span
          key={stage}
          className="teaser-run grid h-5 w-5 place-items-center rounded-full border border-amber-500/40 font-mono text-[7px] text-amber-300"
          style={{ animation: `pulse-node 1.5s ${i * 0.22}s ease-in-out infinite` }}
        >
          {stage}
        </span>
      ))}
    </div>
  );
}

function ResumeAiTeaser() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#12160f] p-1.5">
      <div className="relative mx-auto h-full w-[72%] rounded-sm bg-[#f4efe6]">
        <div className="space-y-1 p-1.5">
          <div className="h-1 w-4/5 rounded bg-[#0f141c]/25" />
          <div className="h-1 w-full rounded bg-[#0f141c]/12" />
          <div className="h-1 w-3/5 rounded bg-[#0f141c]/12" />
        </div>
        <div
          className="teaser-run absolute inset-x-0 h-3 bg-amber-400/25"
          style={{ animation: "scan-line 2.2s ease-in-out infinite" }}
        />
      </div>
    </div>
  );
}

function FoxusTeaser() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#121820] p-2">
      <div className="space-y-1.5">
        {["Intro", "Core idea", "Quiz"].map((row, i) => (
          <div
            key={row}
            className="teaser-run flex items-center gap-2 rounded-md border border-amber-500/20 bg-white/5 px-2 py-1 font-mono text-[8px] text-amber-300"
            style={{ animation: `pulse-node 1.8s ${i * 0.25}s ease-in-out infinite` }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            {row}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProjectTeaser({ project, showPlay }: { project: Project; showPlay?: boolean }) {
  const inner = {
    "free-ai-pool": <FreeAiTeaser />,
    "react-brai": <BraiTeaser />,
    selldocs: <SelldocsTeaser />,
    socio: <SocioTeaser />,
    hiretrack: <HireTrackTeaser />,
    "foxus-ai": <FoxusTeaser />,
    "ht-license": <LicenseTeaser />,
    "ht-ota": <OtaTeaser />,
    "ht-landing": <LandingTeaser />,
    "presence-sync": <PresenceTeaser />,
    "ht-ci": <CiTeaser />,
    "ht-resume-ai": <ResumeAiTeaser />,
  }[project.id] ?? <BraiTeaser />;

  return (
    <div className="relative h-full w-full">
      {inner}
      {showPlay ? <PlayMark /> : null}
    </div>
  );
}
