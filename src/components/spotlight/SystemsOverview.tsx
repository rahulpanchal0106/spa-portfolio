"use client";

import { useState } from "react";
import { ExcalidrawViewer } from "@/components/spotlight/ExcalidrawViewer";
import { MacWindow } from "@/components/system/MacWindow";
import { cn } from "@/lib/cn";
import {
  sceneForMode,
  systemModes,
  systems,
  type SystemId,
  type SystemMode,
} from "@/lib/systems";

export function SystemsOverview({ className }: { className?: string }) {
  const [active, setActive] = useState<SystemId>("selldocs");
  const [mode, setMode] = useState<SystemMode>("functional");
  const system = systems.find((item) => item.id === active) ?? systems[0];
  const sceneUrl = sceneForMode(system, mode);

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
            {systemModes.map((item) => (
              <button
                key={item.id}
                type="button"
                title={item.label}
                onClick={() => setMode(item.id)}
                className={cn(
                  "rounded px-2 py-0.5 text-[10px] font-medium",
                  mode === item.id ? "bg-white/15 text-white" : "text-white/50 hover:text-white/80",
                )}
              >
                {item.short}
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
        {sceneUrl ? (
          <ExcalidrawViewer sceneUrl={sceneUrl} />
        ) : (
          <OverallPlaceholder label={system.label} />
        )}
      </div>
    </MacWindow>
  );
}

/** Mobile: static preview without the heavy Excalidraw bundle. */
export function SystemsOverviewCarousel({
  className,
  framed = true,
}: {
  className?: string;
  framed?: boolean;
}) {
  const [active, setActive] = useState(0);
  const [mode, setMode] = useState<SystemMode>("functional");
  const system = systems[active];
  const sceneUrl = sceneForMode(system, mode);

  const body = (
    <div className="flex min-h-0 flex-1 flex-col gap-2 p-2.5">
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
        {systemModes.map((item) => (
          <button
            key={item.id}
            type="button"
            title={item.label}
            onClick={() => setMode(item.id)}
            className={cn(
              "flex-1 rounded px-2 py-1 text-[11px] font-medium",
              mode === item.id ? "bg-white/15 text-white" : "text-white/50",
            )}
          >
            {item.id === "overall" ? "Overall" : item.label}
          </button>
        ))}
      </div>
      <div className="min-h-[220px] flex-1 overflow-hidden rounded-lg border border-white/10 bg-white">
        {sceneUrl ? (
          <ExcalidrawViewer sceneUrl={sceneUrl} />
        ) : (
          <OverallPlaceholder label={system.label} />
        )}
      </div>
      {system.live ? (
        <a href={system.live} target="_blank" rel="noreferrer" className="text-[11px] text-[#64d2ff]">
          {system.live.replace(/^https?:\/\//, "")}
        </a>
      ) : null}
    </div>
  );

  if (!framed) {
    return <div className={cn("flex h-full min-h-0 flex-col", className)}>{body}</div>;
  }

  return (
    <div className={cn("space-y-2", className)}>
      <MacWindow title="Systems">{body}</MacWindow>
    </div>
  );
}

function OverallPlaceholder({ label }: { label: string }) {
  return (
    <div className="grid h-full place-items-center bg-white px-6 text-center">
      <div>
        <p className="text-[13px] font-medium text-zinc-800">Overall system — coming soon</p>
        <p className="mt-1 text-[12px] text-zinc-500">
          Full architecture for {label} isn’t wired up yet.
        </p>
      </div>
    </div>
  );
}
