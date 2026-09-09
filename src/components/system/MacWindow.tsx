"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useAppPaneId } from "@/components/desktop/AppPane";
import { useOptionalDesktopMode } from "@/components/desktop/DesktopModeProvider";
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
  const desktop = useOptionalDesktopMode();
  const appId = useAppPaneId();
  const [sidebarOpen, setSidebarOpen] = useState(sidebarDefaultOpen);

  useEffect(() => {
    setSidebarOpen(sidebarDefaultOpen);
  }, [sidebarDefaultOpen]);

  const iconsOnly = Boolean(sidebar) && sidebarCollapsible && !sidebarOpen;
  const goHome = desktop?.goHome;
  const alreadySolo = desktop?.isSolo && desktop.soloApp === appId;
  const canSolo = Boolean(desktop?.openSolo && appId && !alreadySolo);

  return (
    <div className={cn("mac-window flex h-full min-h-0 flex-col", className)}>
      <div className="mac-titlebar shrink-0">
        <div className="relative z-10 flex items-center gap-3 pl-3.5">
          <div className="mac-traffic !p-0">
            <button
              type="button"
              className="mac-dot close"
              aria-label="Close — back to Home"
              title="Close"
              disabled={!goHome}
              onClick={() => goHome?.()}
            />
            <button
              type="button"
              className="mac-dot min"
              aria-label="Minimize — back to Home"
              title="Minimize"
              disabled={!goHome}
              onClick={() => goHome?.()}
            />
            <button
              type="button"
              className="mac-dot max"
              aria-label="Focus — open this window alone"
              title="Focus"
              disabled={!canSolo}
              onClick={() => {
                if (appId) desktop?.openSolo(appId);
              }}
            />
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
      {toolbar ? <div className="mac-toolbar shrink-0">{toolbar}</div> : null}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {sidebar ? (
          <aside
            className={cn("mac-sidebar", iconsOnly && "mac-sidebar--icons")}
            aria-label="Sidebar"
          >
            {sidebar}
          </aside>
        ) : null}
        <div className="mac-body">{children}</div>
      </div>
    </div>
  );
}
