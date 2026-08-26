"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ArchitectureFlow } from "@/components/spotlight/ArchitectureFlow";
import { MacWindow } from "@/components/system/MacWindow";
import { cn } from "@/lib/cn";
import { flagships } from "@/lib/projects";

export function Spotlight({ className }: { className?: string }) {
  const [active, setActive] = useState(0);
  const project = flagships[active];

  return (
    <MacWindow
      className={className}
      title={project.name}
      toolbar={
        <div className="flex flex-wrap gap-1">
          {flagships.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "rounded-md px-2.5 py-0.5 text-[12px] font-medium",
                i === active ? "bg-[#0a84ff] text-white" : "text-white/60 hover:bg-white/8 hover:text-white",
              )}
            >
              {item.name}
            </button>
          ))}
        </div>
      }
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={project.id}
          className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden p-2.5"
          initial={{ opacity: 0.35, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22 }}
        >
          <div className="shrink-0">
            <ArchitectureFlow nodes={project.architecture.nodes} title={project.architecture.title} />
          </div>
          <div className="grid min-h-0 flex-1 grid-cols-2 gap-2 overflow-hidden">
            <div className="overflow-auto rounded-lg bg-white/6 p-2.5">
              <p className="text-[11px] font-semibold tracking-wide text-[#0a84ff] uppercase">Challenge</p>
              <p className="mt-1 text-xs leading-relaxed text-white/85">{project.architecture.challenge}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-white/55">{project.architecture.approach}</p>
            </div>
            <div className="overflow-auto rounded-lg bg-white/6 p-2.5">
              <p className="text-[11px] font-semibold tracking-wide text-[#0a84ff] uppercase">Verified</p>
              <ul className="mt-2 space-y-1.5">
                {project.architecture.metrics.map((metric) => (
                  <li key={metric} className="flex items-start gap-2 text-xs text-white/85">
                    <span className="mt-0.5 text-[#30d158]">✓</span>
                    {metric}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </MacWindow>
  );
}

export function SpotlightCarousel({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="no-scrollbar flex snap-x snap-mandatory gap-2 overflow-x-auto">
        {flagships.map((project) => (
          <MacWindow key={project.id} title={project.name} className="min-w-[min(100%,22rem)] shrink-0 snap-center">
            <div className="p-2.5">
              <ArchitectureFlow nodes={project.architecture.nodes} title={project.architecture.title} />
              <p className="mt-3 text-xs leading-relaxed text-white/75">{project.architecture.challenge}</p>
              <ul className="mt-2 space-y-1">
                {project.architecture.metrics.map((metric) => (
                  <li key={metric} className="flex gap-2 text-[11px] text-white/85">
                    <span className="text-[#30d158]">✓</span>
                    {metric}
                  </li>
                ))}
              </ul>
            </div>
          </MacWindow>
        ))}
      </div>
    </div>
  );
}
