export type SystemMode = "functional" | "nonfunctional" | "overall";

export type SystemId = "selldocs" | "hiretrack" | "license" | "free-ai-pool";

export type SystemDef = {
  id: SystemId;
  label: string;
  live?: string;
  scenes: {
    functional: string;
    nonfunctional: string;
    /** Full-system architecture — optional until the diagram is ready. */
    overall?: string;
  };
};

export const systemModes: { id: SystemMode; short: string; label: string }[] = [
  { id: "functional", short: "FR", label: "Functional" },
  { id: "nonfunctional", short: "NFR", label: "Non-functional" },
  { id: "overall", short: "Overall", label: "Overall system" },
];

export const systems: SystemDef[] = [
  {
    id: "selldocs",
    label: "Selldocs",
    live: "https://selldocs.store",
    scenes: {
      functional: "/systems/selldocs.functional.excalidraw",
      nonfunctional: "/systems/selldocs.nonfunctional.excalidraw",
    },
  },
  {
    id: "hiretrack",
    label: "HireTrack",
    live: "https://hiretrack.in",
    scenes: {
      functional: "/systems/hiretrack.functional.excalidraw",
      nonfunctional: "/systems/hiretrack.nonfunctional.excalidraw",
    },
  },
  {
    id: "license",
    label: "License",
    live: "https://admin.hiretrack.in",
    scenes: {
      functional: "/systems/license.functional.excalidraw",
      nonfunctional: "/systems/license.nonfunctional.excalidraw",
    },
  },
  {
    id: "free-ai-pool",
    label: "AI Pool",
    live: "https://www.npmjs.com/package/free-ai-pool",
    scenes: {
      functional: "/systems/free-ai-pool.functional.excalidraw",
      nonfunctional: "/systems/free-ai-pool.nonfunctional.excalidraw",
      overall: "/systems/free-ai-pool.full.excalidraw",
    },
  },
];

export function sceneForMode(system: SystemDef, mode: SystemMode): string | null {
  if (mode === "overall") return system.scenes.overall ?? null;
  return system.scenes[mode];
}
