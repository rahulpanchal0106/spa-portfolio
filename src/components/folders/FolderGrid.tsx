"use client";

import { useState } from "react";
import { FolderCard } from "@/components/folders/FolderCard";
import { ProjectModal } from "@/components/folders/ProjectModal";
import { MacWindow } from "@/components/system/MacWindow";
import { cn } from "@/lib/cn";
import { experience, resume } from "@/lib/profile";
import { projects, type Project } from "@/lib/projects";
import { site, skillGroups } from "@/lib/site";

export type FinderSection = "projects" | "resume" | "experience" | "skills";

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

function ProjectsPane({ columns, onOpen }: { columns: 3 | 4; onOpen: (project: Project) => void }) {
  const rows = Math.ceil(projects.length / columns);
  return (
    <div
      className="grid min-h-0 flex-1 content-start gap-1 p-2"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(5.25rem, 1fr))`,
      }}
    >
      {projects.map((project) => (
        <FolderCard key={project.id} project={project} onOpen={() => onOpen(project)} />
      ))}
    </div>
  );
}

function ResumePane() {
  return (
    <div className="min-h-0 flex-1 overflow-auto p-4">
      <article className="mac-paper mx-auto max-w-lg px-5 py-5">
        <h2 className="text-[15px] font-semibold tracking-tight text-[#1d1d1f]">{site.name}</h2>
        <p className="text-[12px] text-[#6e6e73]">
          {site.role} · {site.location}
        </p>
        <p className="mt-3 text-[12px] leading-relaxed text-[#3a3a3c]">{resume.blurb}</p>
        <p className="mt-3 text-[12px] font-medium text-[#1d1d1f]">{resume.headline}</p>
        <ul className="mt-3 space-y-1.5">
          {resume.highlights.map((item) => (
            <li key={item} className="flex gap-2 text-[12px] text-[#3a3a3c]">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#0a84ff]" />
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[11px] text-[#6e6e73]">{site.email}</p>
      </article>
    </div>
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
              <span
                key={skill}
                className="rounded-md bg-white/8 px-2 py-1 text-[12px] text-white/85"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export function FolderGrid({ className, columns = 4 }: { className?: string; columns?: 3 | 4 }) {
  const [section, setSection] = useState<FinderSection>("projects");
  const [open, setOpen] = useState<Project | null>(null);
  const active = NAV.find((item) => item.id === section);

  return (
    <>
      <MacWindow
        title={active?.label ?? "Finder"}
        className={className}
        sidebar={
          <nav className="flex flex-col gap-0.5">
            <p className="mac-sidebar-label">Favorites</p>
            {NAV.map((item) => (
              <button
                key={item.id}
                type="button"
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
        {section === "projects" ? <ProjectsPane columns={columns} onOpen={setOpen} /> : null}
        {section === "resume" ? <ResumePane /> : null}
        {section === "experience" ? <ExperiencePane /> : null}
        {section === "skills" ? <SkillsPane /> : null}
      </MacWindow>
      <ProjectModal project={open} onClose={() => setOpen(null)} />
    </>
  );
}
