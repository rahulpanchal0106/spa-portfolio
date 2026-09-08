"use client";

import { useState } from "react";
import { ExcalidrawViewer } from "@/components/spotlight/ExcalidrawViewer";
import { MacWindow } from "@/components/system/MacWindow";
import { cn } from "@/lib/cn";
import { systems, type SystemId, type SystemMode } from "@/lib/systems";

export function SystemsOverview({ className }: { className?: string }) {
  const [active, setActive] = useState<SystemId>("selldocs");
  const [mode, setMode] = useState<SystemMode>("functional");
  const system = systems.find((item) => item.id === active) ?? systems[0];

  return (
    <MacWindow
      className={className}
      title="Systems"
      toolbar={
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <div className="no-scrollbar flex min-w-0 flex-1 gap-1 overflow-x-auto">
            {systems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActive(item.id)}
                className={cn(
                  "shrink-0 rounded-md px-2 py-0.5 text-[11px] font-medium",
                  item.id === active ? "bg-[#0a84ff] text-white" : "text-white/60 hover:bg-white/8 hover:text-white",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex shrink-0 rounded-md bg-white/8 p-0.5">
            {(["functional", "nonfunctional"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setMode(item)}
                className={cn(
                  "rounded px-2 py-0.5 text-[10px] font-medium",
                  mode === item ? "bg-white/15 text-white" : "text-white/50 hover:text-white/80",
                )}
              >
                {item === "functional" ? "FR" : "NFR"}
              </button>
            ))}
          </div>
          {system.live ? (
            <a
              href={system.live}
              target="_blank"
              rel="noreferrer"
              className="hidden shrink-0 text-[10px] text-[#64d2ff] hover:underline sm:inline"
            >
              Live
            </a>
          ) : null}
        </div>
      }
    >
      <div className="min-h-0 flex-1">
        <ExcalidrawViewer sceneUrl={system.scenes[mode]} />
      </div>
    </MacWindow>
  );
}

/** Mobile: static preview without the heavy Excalidraw bundle. */
export function SystemsOverviewCarousel({ className }: { className?: string }) {
  const [active, setActive] = useState(0);
  const [mode, setMode] = useState<SystemMode>("functional");
  const system = systems[active];

  return (
    <div className={cn("space-y-2", className)}>
      <MacWindow title="Systems">
        <div className="flex flex-col gap-2 p-2.5">
          <div className="no-scrollbar flex gap-1 overflow-x-auto">
            {systems.map((item, i) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActive(i)}
                className={cn(
                  "shrink-0 rounded-md px-2.5 py-0.5 text-[12px] font-medium",
                  i === active ? "bg-[#0a84ff] text-white" : "text-white/60 hover:bg-white/8",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex rounded-md bg-white/8 p-0.5">
            {(["functional", "nonfunctional"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setMode(item)}
                className={cn(
                  "flex-1 rounded px-2 py-1 text-[11px] font-medium",
                  mode === item ? "bg-white/15 text-white" : "text-white/50",
                )}
              >
                {item === "functional" ? "Functional" : "Non-functional"}
              </button>
            ))}
          </div>
          <div className="h-[220px] overflow-hidden rounded-lg border border-white/10 bg-white">
            <ExcalidrawViewer sceneUrl={system.scenes[mode]} />
          </div>
          {system.live ? (
            <a href={system.live} target="_blank" rel="noreferrer" className="text-[11px] text-[#64d2ff]">
              {system.live.replace(/^https?:\/\//, "")}
            </a>
          ) : null}
        </div>
      </MacWindow>
    </div>
  );
}
