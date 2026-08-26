"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { ArchitectureFlow } from "@/components/spotlight/ArchitectureFlow";
import { ProjectTeaser } from "@/components/folders/ProjectTeaser";
import type { Project } from "@/lib/projects";

export function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!project) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project ? (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 lg:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-neutral-950/60 backdrop-blur-sm"
            aria-label="Close project window"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal
            aria-labelledby="project-window-title"
            className="mac-window relative z-10 flex max-h-[min(90vh,760px)] w-full max-w-3xl flex-col overflow-hidden"
            initial={{ y: 18, scale: 0.97, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 12, scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
          >
            <header className="mac-titlebar">
              <div className="mac-traffic" aria-hidden>
                <button type="button" className="mac-dot close" aria-label="Close" onClick={onClose} />
                <span className="mac-dot min" />
                <span className="mac-dot max" />
              </div>
              <h2 id="project-window-title" className="mac-title">
                {project.name}
              </h2>
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              <div className="teaser-live mb-4 h-36 overflow-hidden rounded-xl border border-white/10">
                <ProjectTeaser project={project} />
              </div>
              <p className="mb-4 text-sm leading-relaxed text-stone-200/90">{project.summary}</p>
              <ArchitectureFlow nodes={project.architecture.nodes} title={project.architecture.title} />
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-white/8 bg-white/4 p-3">
                  <p className="text-[11px] font-semibold tracking-wide text-[#0a84ff] uppercase">Challenge</p>
                  <p className="mt-1 text-xs leading-relaxed text-neutral-300">{project.architecture.challenge}</p>
                  <p className="mt-2 text-xs leading-relaxed text-neutral-400">{project.architecture.approach}</p>
                </div>
                <div className="rounded-xl border border-white/8 bg-white/4 p-3">
                  <p className="text-[11px] font-semibold tracking-wide text-[#0a84ff] uppercase">Verified</p>
                  <ul className="mt-2 space-y-1.5">
                    {project.architecture.metrics.map((metric) => (
                      <li key={metric} className="flex items-start gap-2 text-xs text-neutral-200">
                        <span className="mt-0.5 text-[#30d158]">✓</span>
                        {metric}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <pre className="mt-4 overflow-x-auto rounded-xl border border-white/8 bg-[#0b0f14]/80 p-3 font-mono text-[11px] leading-relaxed text-stone-300">
                <span className="text-stone-500">{project.snippet.file}</span>
                {"\n"}
                {project.snippet.code}
              </pre>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.live ? (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md bg-[#0a84ff] px-4 py-2 text-xs font-semibold text-white"
                  >
                    Live demo
                  </a>
                ) : null}
                {project.repo ? (
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md bg-white/10 px-4 py-2 text-xs font-semibold text-white/90"
                  >
                    Source
                  </a>
                ) : null}
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
