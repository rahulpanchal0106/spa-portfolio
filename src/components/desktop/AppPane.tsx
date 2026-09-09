"use client";

import type { ReactNode } from "react";
import { useDesktopMode, type WindowAppId } from "@/components/desktop/DesktopModeProvider";
import { cn } from "@/lib/cn";

/** Keeps the app mounted; promotes it to a floating solo dialog when selected from Home. */
export function AppPane({
  app,
  children,
  className,
}: {
  app: WindowAppId;
  children: ReactNode;
  className?: string;
}) {
  const { mode, soloApp } = useDesktopMode();
  const isSolo = mode === "solo" && soloApp === app;
  const isDimmed = mode === "solo" && soloApp !== app;

  return (
    <div
      className={cn(
        "h-full min-h-0",
        className,
        isSolo && "app-pane--solo",
        isDimmed && "app-pane--dimmed",
      )}
      data-app={app}
      data-solo={isSolo ? "true" : "false"}
    >
      {children}
    </div>
  );
}
