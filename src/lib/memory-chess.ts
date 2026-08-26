import "server-only";

import { EventEmitter } from "node:events";
import { START_FEN } from "@/lib/chess-core";
import type { ChessEvent } from "@/lib/redis";

type Hub = {
  bus: EventEmitter;
  fen: string;
  connections: number;
};

const globalForChess = globalThis as typeof globalThis & { __chessHub?: Hub };

function hub(): Hub {
  if (!globalForChess.__chessHub) {
    const bus = new EventEmitter();
    bus.setMaxListeners(200);
    globalForChess.__chessHub = { bus, fen: START_FEN, connections: 0 };
  }
  return globalForChess.__chessHub;
}

export function memoryFen() {
  return hub().fen;
}

export function setMemoryFen(fen: string) {
  hub().fen = fen;
}

export function memoryConnections() {
  return hub().connections;
}

export function bumpMemoryConnections(delta: number) {
  hub().connections = Math.max(0, hub().connections + delta);
  return hub().connections;
}

export function publishMemory(event: ChessEvent) {
  hub().bus.emit("chess", event);
}

export function subscribeMemory(listener: (event: ChessEvent) => void) {
  const bus = hub().bus;
  bus.on("chess", listener);
  return () => {
    bus.off("chess", listener);
  };
}
