"use client";

import { useEffect, useRef, useState } from "react";
import { ProjectTeaser } from "@/components/folders/ProjectTeaser";
import { cn } from "@/lib/cn";
import { projects, type Project } from "@/lib/projects";

const FEATURED_IDS = ["hiretrack", "selldocs", "react-brai"] as const;

export const featuredProjects: Project[] = FEATURED_IDS.map(
  (id) => projects.find((project) => project.id === id)!,
).filter(Boolean);

export function FeaturedWorkWidget({ onOpen }: { onOpen: (project: Project) => void }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const node = scrollerRef.current;
    if (!node) return;
    const onScroll = () => {
      const next = Math.round(node.scrollLeft / Math.max(node.clientWidth, 1));
      setIndex(next);
    };
    node.addEventListener("scroll", onScroll, { passive: true });
    return () => node.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="overflow-hidden rounded-[1.35rem] border border-white/10 bg-black/45 shadow-[0_10px_30px_rgb(0_0_0_/_0.28)] backdrop-blur-md">
      <div className="flex items-center justify-between gap-2 px-3.5 pt-3 pb-2">
        <div>
          <p className="text-[11px] font-semibold tracking-wide text-white/45 uppercase">Best Work</p>
          <p className="text-[15px] font-semibold text-white">Featured projects</p>
        </div>
        <div className="flex items-center gap-1" aria-hidden>
          {featuredProjects.map((project, i) => (
            <span
              key={project.id}
              className={cn("h-1.5 w-1.5 rounded-full transition", i === index ? "bg-white" : "bg-white/30")}
            />
          ))}
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="featured-work-pages flex snap-x snap-mandatory overflow-x-auto pb-3"
      >
        {featuredProjects.map((project) => (
          <button
            key={project.id}
            type="button"
            onClick={() => onOpen(project)}
            className="group teaser-live w-full shrink-0 basis-full snap-center px-3 text-left"
          >
            <div className="overflow-hidden rounded-xl border border-white/10 bg-black/25">
              <div className="h-[7.25rem]">
                <ProjectTeaser project={project} showPlay />
              </div>
              <div className="flex items-center justify-between gap-2 px-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-semibold text-white">{project.shortName}</p>
                  <p className="truncate text-[12px] text-white/55">{project.subtitle}</p>
                </div>
                <span className="shrink-0 text-[12px] font-medium text-[#64d2ff] group-active:text-white">
                  Open
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
