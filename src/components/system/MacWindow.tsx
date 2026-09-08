"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  title: string;
  className?: string;
  children: ReactNode;
  sidebar?: ReactNode;
  toolbar?: ReactNode;
  /** Finder-style: collapse sidebar to icons only. */
  sidebarCollapsible?: boolean;
  sidebarDefaultOpen?: boolean;
};

export function MacWindow({
  title,
  className,
  children,
  sidebar,
  toolbar,
  sidebarCollapsible = false,
  sidebarDefaultOpen = true,
}: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(sidebarDefaultOpen);

  useEffect(() => {
    setSidebarOpen(sidebarDefaultOpen);
  }, [sidebarDefaultOpen]);

  const iconsOnly = Boolean(sidebar) && sidebarCollapsible && !sidebarOpen;

  return (
    <div className={cn("mac-window flex min-h-0 flex-col", className)}>
      <div className="mac-titlebar">
        <div className="relative z-10 flex items-center gap-3 pl-3.5">
          <div className="mac-traffic !p-0" aria-hidden>
            <span className="mac-dot close" />
            <span className="mac-dot min" />
            <span className="mac-dot max" />
          </div>
          {sidebar && sidebarCollapsible ? (
            <button
              type="button"
              className="grid h-6 w-6 place-items-center rounded-md text-white/70 hover:bg-white/10 hover:text-white"
              aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
              aria-expanded={sidebarOpen}
              title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
              onClick={() => setSidebarOpen((open) => !open)}
            >
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.4">
                <rect x="2" y="2.5" width="12" height="11" rx="1.5" />
                <path d="M6 2.5v11" />
              </svg>
            </button>
          ) : null}
        </div>
        <p className="mac-title">{title}</p>
      </div>
      {toolbar ? <div className="mac-toolbar">{toolbar}</div> : null}
      <div className="flex min-h-0 flex-1">
        {sidebar ? (
          <aside
            className={cn("mac-sidebar", iconsOnly && "mac-sidebar--icons")}
            aria-label="Sidebar"
          >
            {sidebar}
          </aside>
        ) : null}
        <div className="mac-body flex min-h-0 flex-1 flex-col">{children}</div>
      </div>
    </div>
  );
}
