"use client";

import { useMemo, useState } from "react";
import { FolderCard, MacFolderIcon } from "@/components/folders/FolderCard";
import { cn } from "@/lib/cn";
import { projects, type Project } from "@/lib/projects";

export type FinderViewMode = "icons" | "list";
type SortKey = "name" | "date" | "kind";

function formatDate(iso: string) {
  const date = new Date(`${iso}T12:00:00`);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function kindFor(project: Project) {
  if (project.tags.includes("Bash") || project.id === "ht-ota") return "Shell Script";
  if (project.live?.includes("npmjs")) return "Package";
  if (project.id.startsWith("ht-")) return "Folder";
  return "Application";
}

export function ProjectsIconsView({
  columns,
  onOpen,
}: {
  columns: 3 | 4;
  onOpen: (project: Project) => void;
}) {
  return (
    <div
      className="grid h-full min-h-0 content-start gap-x-1 gap-y-1 overflow-auto p-2"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gridAutoRows: "max-content",
      }}
    >
      {projects.map((project) => (
        <FolderCard key={project.id} project={project} onOpen={() => onOpen(project)} />
      ))}
    </div>
  );
}

export function ProjectsListView({ onOpen }: { onOpen: (project: Project) => void }) {
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [ascending, setAscending] = useState(true);

  const rows = useMemo(() => {
    const sorted = [...projects].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.name.localeCompare(b.name);
      else if (sortKey === "date") cmp = a.startedAt.localeCompare(b.startedAt);
      else cmp = kindFor(a).localeCompare(kindFor(b));
      return ascending ? cmp : -cmp;
    });
    return sorted;
  }, [ascending, sortKey]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setAscending((value) => !value);
    else {
      setSortKey(key);
      setAscending(key !== "date");
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="finder-list-header grid shrink-0 grid-cols-[minmax(0,1fr)_5.75rem_4.5rem] gap-2 border-b border-white/10 px-3 py-1.5 text-[11px] font-medium text-white/45">
        <SortHeader active={sortKey === "name"} ascending={ascending} onClick={() => toggleSort("name")}>
          Name
        </SortHeader>
        <SortHeader active={sortKey === "date"} ascending={ascending} onClick={() => toggleSort("date")}>
          Date Created
        </SortHeader>
        <SortHeader active={sortKey === "kind"} ascending={ascending} onClick={() => toggleSort("kind")}>
          Kind
        </SortHeader>
      </div>
      <div className="min-h-0 flex-1 overflow-auto px-1 py-0.5">
        {rows.map((project) => (
          <button
            key={project.id}
            type="button"
            onClick={() => onOpen(project)}
            className="grid w-full grid-cols-[minmax(0,1fr)_5.75rem_4.5rem] items-center gap-2 rounded-md px-2 py-0.5 text-left hover:bg-[#0a84ff]/25 focus-visible:bg-[#0a84ff]/30"
          >
            <span className="flex min-w-0 items-center gap-1.5">
              <MacFolderIcon className="h-3.5 w-4 shrink-0 drop-shadow-none" />
              <span className="truncate text-[12px] font-medium text-white/90">{project.name}</span>
            </span>
            <span className="truncate text-[11px] text-white/55">{formatDate(project.startedAt)}</span>
            <span className="truncate text-[11px] text-white/55">{kindFor(project)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function SortHeader({
  children,
  active,
  ascending,
  onClick,
  className,
}: {
  children: string;
  active: boolean;
  ascending: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("inline-flex items-center gap-1 text-left hover:text-white/70", className)}
    >
      {children}
      {active ? <span className="text-[9px] text-white/50">{ascending ? "▲" : "▼"}</span> : null}
    </button>
  );
}

export function FinderViewToggle({
  mode,
  onChange,
}: {
  mode: FinderViewMode;
  onChange: (mode: FinderViewMode) => void;
}) {
  return (
    <div className="ml-auto flex items-center rounded-md bg-white/8 p-0.5">
      <button
        type="button"
        title="as Icons"
        aria-pressed={mode === "icons"}
        onClick={() => onChange("icons")}
        className={cn(
          "grid h-6 w-7 place-items-center rounded text-white/55 hover:text-white",
          mode === "icons" && "bg-white/15 text-white",
        )}
      >
        <svg viewBox="0 0 14 14" className="h-3.5 w-3.5" aria-hidden fill="currentColor">
          <rect x="1" y="1" width="5" height="5" rx="1" />
          <rect x="8" y="1" width="5" height="5" rx="1" />
          <rect x="1" y="8" width="5" height="5" rx="1" />
          <rect x="8" y="8" width="5" height="5" rx="1" />
        </svg>
      </button>
      <button
        type="button"
        title="as List"
        aria-pressed={mode === "list"}
        onClick={() => onChange("list")}
        className={cn(
          "grid h-6 w-7 place-items-center rounded text-white/55 hover:text-white",
          mode === "list" && "bg-white/15 text-white",
        )}
      >
        <svg viewBox="0 0 14 14" className="h-3.5 w-3.5" aria-hidden fill="currentColor">
          <rect x="1" y="2" width="12" height="1.6" rx="0.5" />
          <rect x="1" y="6.2" width="12" height="1.6" rx="0.5" />
          <rect x="1" y="10.4" width="12" height="1.6" rx="0.5" />
        </svg>
      </button>
    </div>
  );
}
