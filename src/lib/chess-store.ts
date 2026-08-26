import "server-only";

import { START_FEN } from "@/lib/chess-core";
import {
  bumpMemoryConnections,
  memoryConnections,
  memoryFen,
  publishMemory,
  setMemoryFen,
} from "@/lib/memory-chess";
import {
  CHESS_CONNECTIONS_KEY,
  CHESS_FEN_KEY,
  compareAndSetFen,
  freshRedisGet,
  getRedis,
  publishChess,
  type ChessEvent,
} from "@/lib/redis";
import type { ChessSnapshot } from "@/lib/types";

export type { ChessSnapshot };

export async function getChessSnapshot(): Promise<ChessSnapshot> {
  const redis = getRedis();
  if (!redis) {
    return {
      fen: memoryFen(),
      connections: memoryConnections(),
      realtime: "local",
    };
  }
  const [fen, connections] = await Promise.all([
    redis.get<string>(CHESS_FEN_KEY),
    redis.get<number | string>(CHESS_CONNECTIONS_KEY),
  ]);
  return {
    fen: fen || START_FEN,
    connections: Number(connections ?? 0),
    realtime: "upstash",
  };
}

export async function getChessSnapshotFresh(): Promise<ChessSnapshot | null> {
  if (!getRedis()) {
    return {
      fen: memoryFen(),
      connections: memoryConnections(),
      realtime: "local",
    };
  }
  const fen = await freshRedisGet(CHESS_FEN_KEY);
  if (!fen) return null;
  const connections = await freshRedisGet(CHESS_CONNECTIONS_KEY);
  return {
    fen,
    connections: Number(connections ?? 0),
    realtime: "upstash",
  };
}

export async function applyFen(previousFen: string, newFen: string): Promise<ChessSnapshot> {
  const redis = getRedis();
  if (!redis) {
    const current = memoryFen() || START_FEN;
    if (current !== previousFen && current !== newFen) {
      return { fen: current, connections: memoryConnections(), realtime: "local" };
    }
    setMemoryFen(newFen);
    const snapshot: ChessSnapshot = {
      fen: newFen,
      connections: memoryConnections(),
      realtime: "local",
    };
    publishMemory({ type: "state", fen: snapshot.fen, connections: snapshot.connections });
    return snapshot;
  }

  const written = await compareAndSetFen(previousFen, newFen);
  const connections = Number((await redis.get<number | string>(CHESS_CONNECTIONS_KEY)) ?? 0);
  const fen = written || (await redis.get<string>(CHESS_FEN_KEY)) || START_FEN;
  const snapshot: ChessSnapshot = { fen, connections, realtime: "upstash" };
  if (fen === newFen) {
    // Same-process SSE listeners always get the move, even if Redis pub/sub is down.
    publishMemory({ type: "state", fen, connections });
    await publishChess({ type: "state", fen, connections });
  }
  return snapshot;
}

export async function bumpConnections(delta: number): Promise<ChessEvent> {
  const redis = getRedis();
  if (!redis) {
    const connections = bumpMemoryConnections(delta);
    const event: ChessEvent = { type: "state", fen: memoryFen(), connections };
    publishMemory(event);
    return event;
  }
  const connections =
    delta >= 0
      ? Number(await redis.incrby(CHESS_CONNECTIONS_KEY, delta))
      : Math.max(0, Number(await redis.incrby(CHESS_CONNECTIONS_KEY, delta)));
  if (connections < 0) {
    await redis.set(CHESS_CONNECTIONS_KEY, 0);
  }
  const fen = (await redis.get<string>(CHESS_FEN_KEY)) || START_FEN;
  const event: ChessEvent = {
    type: "state",
    fen,
    connections: Math.max(0, connections),
  };
  publishMemory(event);
  await publishChess(event);
  return event;
}
