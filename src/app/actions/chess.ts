"use server";

import { isLegalSuccessor, isValidFen } from "@/lib/chess-core";
import { applyFen, getChessSnapshot, type ChessSnapshot } from "@/lib/chess-store";

export async function makeMove(
  previousFen: string,
  newFen: string,
): Promise<{ ok: boolean; snapshot: ChessSnapshot; reason?: string }> {
  if (
    typeof previousFen !== "string" ||
    typeof newFen !== "string" ||
    previousFen.length > 256 ||
    newFen.length > 256 ||
    !isValidFen(previousFen) ||
    !isValidFen(newFen)
  ) {
    return { ok: false, snapshot: await getChessSnapshot(), reason: "invalid" };
  }

  if (!isLegalSuccessor(previousFen, newFen)) {
    return { ok: false, snapshot: await getChessSnapshot(), reason: "illegal" };
  }

  const snapshot = await applyFen(previousFen, newFen);
  return { ok: snapshot.fen === newFen, snapshot, reason: snapshot.fen === newFen ? undefined : "conflict" };
}
