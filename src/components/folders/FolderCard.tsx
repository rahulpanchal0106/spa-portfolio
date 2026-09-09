"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import type { Project } from "@/lib/projects";

/** Solid fills — gradient url(#id) breaks when an ancestor has transform (mobile app sheets). */
export function MacFolderIcon({ className }: { gid?: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 64 52"
      className={cn("h-12 w-[3.65rem] drop-shadow-[0_4px_8px_rgba(0,40,80,0.28)]", className)}
      aria-hidden
    >
      <path d="M6 14c0-2.2 1.8-4 4-4h12.4c1.1 0 2.1.5 2.8 1.3L28 14H10c-2.2 0-4 1.3-4 3.2V14Z" fill="#8adcff" />
      <path
        d="M6 16.5c0-2.5 2-4.5 4.5-4.5h43c2.5 0 4.5 2 4.5 4.5v26c0 2.5-2 4.5-4.5 4.5h-43c-2.5 0-4.5-2-4.5-4.5v-26Z"
        fill="#32ade6"
      />
      <path d="M8.5 20c0-1.4 1.1-2.5 2.5-2.5h42c1.4 0 2.5 1.1 2.5 2.5v4.5H8.5V20Z" fill="#fff" fillOpacity="0.22" />
      <path
        d="M6 28.5c0 0 4 10 26 10s26-10 26-10v14c0 2.5-2 4.5-4.5 4.5h-43c-2.5 0-4.5-2-4.5-4.5v-14Z"
        fill="#0a84ff"
        fillOpacity="0.55"
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
        "group flex w-full flex-col items-center gap-1 rounded-lg px-1.5 py-2 text-center",
        "hover:bg-[#0a84ff]/22 focus-visible:bg-[#0a84ff]/28",
      )}
    >
      <MacFolderIcon />
      <span className="w-full truncate px-0.5 text-[11px] leading-tight font-medium text-white/90 group-hover:text-white">
        {project.shortName}
      </span>
    </motion.button>
  );
}
