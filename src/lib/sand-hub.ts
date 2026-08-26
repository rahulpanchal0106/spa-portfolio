import "server-only";

import { EventEmitter } from "node:events";
import type { SandEvent } from "@/lib/sand-core";

type Hub = { bus: EventEmitter };

const globalForSand = globalThis as typeof globalThis & { __sandHub?: Hub };

function hub(): Hub {
  if (!globalForSand.__sandHub) {
    const bus = new EventEmitter();
    bus.setMaxListeners(200);
    globalForSand.__sandHub = { bus };
  }
  return globalForSand.__sandHub;
}

export function publishSandMemory(event: SandEvent) {
  hub().bus.emit("sand", event);
}

export function subscribeSandMemory(listener: (event: SandEvent) => void) {
  const bus = hub().bus;
  bus.on("sand", listener);
  return () => {
    bus.off("sand", listener);
  };
}
