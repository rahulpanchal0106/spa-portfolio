"use server";

import { parseSandStroke, type SandEvent, type SandStroke } from "@/lib/sand-core";
import { publishSand } from "@/lib/sand-store";

const MAX_BATCH = 40;

export async function publishSandStroke(input: unknown): Promise<{ ok: boolean }> {
  const stroke = parseSandStroke(input);
  if (!stroke) return { ok: false };
  const event: SandEvent = { type: "stroke", stroke };
  await publishSand(event);
  return { ok: true };
}

export async function publishSandStrokes(input: unknown): Promise<{ ok: boolean }> {
  const list = Array.isArray(input) ? input : [input];
  const strokes: SandStroke[] = [];
  for (const item of list.slice(0, MAX_BATCH)) {
    const stroke = parseSandStroke(item);
    if (stroke) strokes.push(stroke);
  }
  if (!strokes.length) return { ok: false };
  const event: SandEvent =
    strokes.length === 1 ? { type: "stroke", stroke: strokes[0] } : { type: "strokes", strokes };
  await publishSand(event);
  return { ok: true };
}

export async function clearSandWorld(): Promise<{ ok: boolean }> {
  await publishSand({ type: "clear" });
  return { ok: true };
}

export type { SandStroke };
