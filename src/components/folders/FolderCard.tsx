"use client";

import { motion } from "framer-motion";
import { ProjectTeaser } from "@/components/folders/ProjectTeaser";
import { cn } from "@/lib/cn";
import type { Project } from "@/lib/projects";

function MacFolder({ gid }: { gid: string }) {
  return (
    <svg viewBox="0 0 96 80" className="h-full w-full drop-shadow-[0_6px_10px_rgba(0,40,80,0.35)]" aria-hidden>
      <defs>
        <linearGradient id={`${gid}-tab`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7ad4ff" />
          <stop offset="100%" stopColor="#3cb4f0" />
        </linearGradient>
        <linearGradient id={`${gid}-body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5ac8fa" />
          <stop offset="42%" stopColor="#32ade6" />
          <stop offset="100%" stopColor="#0a84ff" />
        </linearGradient>
      </defs>
      <path
        d="M10 22c0-3.4 2.6-6 6-6h18.2c1.7 0 3.3.7 4.4 2l4.2 4.8c.6.7 1.5 1.2 2.5 1.2H80c3.3 0 6 2.7 6 6v36c0 3.3-2.7 6-6 6H16c-3.3 0-6-2.7-6-6V22Z"
        fill={`url(#${gid}-body)`}
      />
      <path
        d="M10 18c0-3.3 2.7-6 6-6h16.6c1.6 0 3.1.7 4.2 1.9L41 20H16c-3.3 0-6-2.2-6-5.5V18Z"
        fill={`url(#${gid}-tab)`}
      />
      <path
        d="M12 28c0-2 1.6-3.5 3.6-3.5h64.8c2 0 3.6 1.5 3.6 3.5v32.5c0 2.6-2 4.5-4.5 4.5H16.5c-2.5 0-4.5-1.9-4.5-4.5V28Z"
        fill="white"
        fillOpacity="0.18"
      />
    </svg>
  );
}

export function FolderCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      whileHover={{ y: -1 }}
      className={cn(
        "group flex h-full min-h-0 flex-col items-center justify-center gap-1 rounded-lg px-1 py-1 text-center",
        "hover:bg-[#0a84ff]/25 focus-visible:bg-[#0a84ff]/30",
      )}
    >
      <div className="relative aspect-[6/5] w-[72%] max-h-[4.8rem]">
        <MacFolder gid={project.id} />
        <div className="absolute inset-[34%_14%_16%_14%] overflow-hidden rounded-[4px] bg-[#0b1220] shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.25)]">
          <ProjectTeaser project={project} />
        </div>
      </div>
      <span className="w-full truncate rounded-sm px-1 text-[11px] leading-tight font-medium text-white/90 group-hover:text-white">
        {project.shortName}
      </span>
    </motion.button>
  );
}
