import "server-only";

import { publishSandMemory } from "@/lib/sand-hub";
import type { SandEvent } from "@/lib/sand-core";

export async function publishSand(event: SandEvent) {
  publishSandMemory(event);
}
