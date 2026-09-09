"use client";

import { useEffect } from "react";
import { ArchitectureFlow } from "@/components/spotlight/ArchitectureFlow";
import { ProjectTeaser } from "@/components/folders/ProjectTeaser";
import { cn } from "@/lib/cn";
import type { Project } from "@/lib/projects";

/** Project detail shown inside Finder or as a mobile app sheet. */
export function ProjectDetail({
  project,
  onBack,
  className,
}: {
  project: Project;
  onBack: () => void;
  className?: string;
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.stopImmediatePropagation();
      onBack();
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [onBack]);

  return (
    <div className={cn("flex h-full min-h-0 flex-col", className)}>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-1 pb-6">
          <div className="teaser-live h-40 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black/20 sm:h-44">
            <ProjectTeaser project={project} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-[22px] leading-tight font-bold tracking-tight text-white">{project.name}</h2>
              {project.live ? (
                <span className="rounded-full bg-[#30d158]/15 px-2 py-0.5 text-[10px] font-semibold text-[#30d158]">
                  Live
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-[14px] text-white/55">{project.subtitle}</p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span key={tag} className="rounded-md bg-white/8 px-2 py-1 text-[11px] text-white/75">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <p className="text-[14px] leading-relaxed text-white/80">{project.summary}</p>

          <div className="rounded-2xl border border-white/8 bg-white/4 p-3">
            <ArchitectureFlow nodes={project.architecture.nodes} title={project.architecture.title} />
          </div>

          <div className="grid gap-3">
            <div className="rounded-2xl border border-white/8 bg-white/4 p-3.5">
              <p className="text-[11px] font-semibold tracking-wide text-[#0a84ff] uppercase">Challenge</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-white/75">{project.architecture.challenge}</p>
              <p className="mt-2 text-[12px] leading-relaxed text-white/50">{project.architecture.approach}</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/4 p-3.5">
              <p className="text-[11px] font-semibold tracking-wide text-[#0a84ff] uppercase">Verified</p>
              <ul className="mt-2 space-y-2">
                {project.architecture.metrics.map((metric) => (
                  <li key={metric} className="flex items-start gap-2 text-[13px] leading-relaxed text-white/80">
                    <span className="mt-0.5 text-[#30d158]">✓</span>
                    <span className="min-w-0">{metric}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/8 bg-[#0b0f14]">
            <p className="border-b border-white/8 px-3 py-2 font-mono text-[11px] text-white/40">{project.snippet.file}</p>
            <pre className="overflow-x-auto p-3 font-mono text-[11px] leading-relaxed whitespace-pre text-stone-300">
              {project.snippet.code}
            </pre>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {project.live ? (
              <a
                href={project.live}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-[#0a84ff] px-4 py-2.5 text-[13px] font-semibold text-white"
              >
                Live demo
              </a>
            ) : null}
            {project.repo ? (
              <a
                href={project.repo}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-white/10 px-4 py-2.5 text-[13px] font-semibold text-white/90"
              >
                Source
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
