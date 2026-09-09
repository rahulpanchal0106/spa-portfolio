"use client";

import { useState } from "react";
import {
  useOptionalDesktopMode,
  type FinderSection,
} from "@/components/desktop/DesktopModeProvider";
import { ProjectDetail } from "@/components/folders/ProjectDetail";
import { ResumePdfViewer } from "@/components/folders/ResumePdfViewer";
import {
  FinderViewToggle,
  ProjectsIconsView,
  ProjectsListView,
  type FinderViewMode,
} from "@/components/folders/ProjectsViews";
import { MacWindow } from "@/components/system/MacWindow";
import { cn } from "@/lib/cn";
import { experience } from "@/lib/profile";
import { projects, type Project } from "@/lib/projects";
import { skillGroups } from "@/lib/site";

export type { FinderSection };

const NAV: { id: FinderSection; label: string }[] = [
  { id: "projects", label: "Projects" },
  { id: "resume", label: "Resume" },
  { id: "experience", label: "Work Experience" },
  { id: "skills", label: "Skills" },
];

function SidebarIcon({ id }: { id: FinderSection }) {
  if (id === "projects") {
    return (
      <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden>
        <path
          d="M2 5.2C2 4 3 3 4.3 3h2.1c.5 0 1 .2 1.3.6L8.4 4.5H12c1.2 0 2.1.9 2.1 2v5.3c0 1.2-.9 2.2-2.1 2.2H4.2C3 14 2 13 2 11.8V5.2Z"
          fill="#5ac8fa"
        />
      </svg>
    );
  }
  if (id === "resume") {
    return (
      <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden>
        <path d="M4 2.2h5.2L13 6v7.8c0 .6-.5 1-1 1H4c-.6 0-1-.4-1-1V3.2c0-.6.4-1 1-1Z" fill="#f2f2f7" />
        <path d="M9.2 2.2 13 6H10c-.5 0-.8-.3-.8-.8V2.2Z" fill="#c7c7cc" />
        <path d="M5 8.2h6M5 10h4.5" stroke="#8e8e93" strokeWidth="1" strokeLinecap="round" />
      </svg>
    );
  }
  if (id === "experience") {
    return (
      <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden>
        <path d="M5.2 4.2V3.4c0-.7.6-1.2 1.3-1.2h3c.7 0 1.3.5 1.3 1.2v.8H13c.6 0 1 .4 1 1V12c0 .6-.4 1-1 1H3c-.6 0-1-.4-1-1V5.2c0-.6.4-1 1-1h2.2Z" fill="#bf5af2" />
        <path d="M5.5 4.2h5V3.5c0-.3-.3-.5-.6-.5H6.1c-.3 0-.6.2-.6.5v.7Z" fill="#e4b8ff" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden>
      <path
        d="M8 1.6 9.7 5l3.8.6-2.7 2.7.6 3.8L8 10.4 4.6 12.1l.6-3.8L2.5 5.6 6.3 5 8 1.6Z"
        fill="#ffd60a"
      />
    </svg>
  );
}

function ExperiencePane() {
  return (
    <div className="min-h-0 flex-1 space-y-3 overflow-auto p-3">
      {experience.map((job) => (
        <article key={job.id} className="rounded-lg bg-white/6 px-3 py-2.5">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-[13px] font-semibold text-white">{job.company}</h3>
            <span className="text-[11px] text-white/45">{job.period}</span>
          </div>
          <p className="text-[12px] text-white/65">
            {job.role} · {job.location}
          </p>
          <p className="mt-1.5 text-[12px] leading-relaxed text-white/75">{job.summary}</p>
          <ul className="mt-2 space-y-1">
            {job.points.map((point) => (
              <li key={point} className="flex gap-2 text-[11px] leading-relaxed text-white/70">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#0a84ff]" />
                {point}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}

function SkillsPane() {
  return (
    <div className="min-h-0 flex-1 space-y-3 overflow-auto p-3">
      {skillGroups.map((group) => (
        <section key={group.label}>
          <p className="mb-1.5 px-1 text-[11px] font-semibold tracking-wide text-white/40 uppercase">
            {group.label}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {group.items.map((skill) => (
              <span key={skill} className="rounded-md bg-white/8 px-2 py-1 text-[12px] text-white/85">
                {skill}
              </span>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export function FolderGrid({
  className,
  columns = 4,
  section: sectionProp,
  onSectionChange,
  variant = "window",
}: {
  className?: string;
  columns?: 3 | 4;
  section?: FinderSection;
  onSectionChange?: (section: FinderSection) => void;
  /** `app` = mobile full-screen UI without macOS window chrome. */
  variant?: "window" | "app";
}) {
  const desktop = useOptionalDesktopMode();
  const [localSection, setLocalSection] = useState<FinderSection>("projects");
  const section = sectionProp ?? desktop?.finderSection ?? localSection;
  const setSection = (next: FinderSection) => {
    setOpen(null);
    onSectionChange?.(next);
    if (desktop) desktop.setFinderSection(next);
    else if (sectionProp === undefined) setLocalSection(next);
  };
  const [view, setView] = useState<FinderViewMode>("icons");
  const [open, setOpen] = useState<Project | null>(null);
  const active = NAV.find((item) => item.id === section);
  const windowTitle = open ? open.name : (active?.label ?? "Finder");

  const body = (
    <>
      {open ? <ProjectDetail project={open} onBack={() => setOpen(null)} /> : null}
      {!open && section === "projects" ? (
        view === "list" ? (
          <ProjectsListView onOpen={setOpen} />
        ) : (
          <ProjectsIconsView columns={columns} onOpen={setOpen} />
        )
      ) : null}
      {!open && section === "resume" ? <ResumePdfViewer /> : null}
      {!open && section === "experience" ? <ExperiencePane /> : null}
      {!open && section === "skills" ? <SkillsPane /> : null}
    </>
  );

  if (variant === "app") {
    return (
      <div className={cn("flex h-full min-h-0 flex-col", className)}>
        <div className="shrink-0 px-1 pb-2">
          {open ? (
            <button
              type="button"
              onClick={() => setOpen(null)}
              className="mb-1 inline-flex items-center gap-1 text-[15px] font-medium text-[#0a84ff]"
            >
              <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M10 3.5 5.5 8 10 12.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Projects
            </button>
          ) : null}
          <div className="flex items-end justify-between gap-3">
            <h1 className="text-[28px] leading-none font-bold tracking-tight text-white">{windowTitle}</h1>
            {!open && section === "projects" ? (
              <FinderViewToggle mode={view} onChange={setView} />
            ) : null}
          </div>
          {!open ? (
            <p className="mt-1 text-[13px] text-white/45">
              {section === "projects" ? `${projects.length} items` : "From Finder"}
            </p>
          ) : null}
        </div>

        {!open ? (
          <div className="no-scrollbar mb-2 flex shrink-0 gap-1.5 overflow-x-auto px-1 pb-1">
            {NAV.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSection(item.id)}
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium transition",
                  section === item.id ? "bg-[#0a84ff] text-white" : "bg-white/10 text-white/70",
                )}
              >
                <SidebarIcon id={item.id} />
                {item.label}
              </button>
            ))}
          </div>
        ) : null}

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl bg-white/6">{body}</div>
      </div>
    );
  }

  return (
    <MacWindow
      title={windowTitle}
      className={className}
      sidebarCollapsible
      toolbar={
        open ? (
          <div className="flex w-full items-center gap-2">
            <button
              type="button"
              onClick={() => setOpen(null)}
              className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[12px] font-medium text-white/75 hover:bg-white/10 hover:text-white"
            >
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M10 3.5 5.5 8 10 12.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Projects
            </button>
          </div>
        ) : section === "projects" ? (
          <div className="flex w-full items-center gap-2">
            <span className="text-[11px] text-white/45">{projects.length} items</span>
            <FinderViewToggle mode={view} onChange={setView} />
          </div>
        ) : undefined
      }
      sidebar={
        <nav className="flex flex-col gap-0.5">
          <p className="mac-sidebar-label">Favorites</p>
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              title={item.label}
              onClick={() => setSection(item.id)}
              className={cn("mac-sidebar-item", section === item.id && "is-active")}
            >
              <SidebarIcon id={item.id} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      }
    >
      {body}
    </MacWindow>
  );
}
