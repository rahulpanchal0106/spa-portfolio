import { Chess, type Square, validateFen } from "chess.js";

export const START_FEN =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;

export function isValidFen(fen: string) {
  return validateFen(fen).ok;
}

export function turnFromFen(fen: string): "w" | "b" {
  try {
    return new Chess(fen).turn();
  } catch {
    return "w";
  }
}

export function isGameOver(fen: string) {
  try {
    return new Chess(fen).isGameOver();
  } catch {
    return false;
  }
}

export function gameStatus(fen: string): "playing" | "check" | "checkmate" | "stalemate" {
  try {
    const game = new Chess(fen);
    if (game.isCheckmate()) return "checkmate";
    if (game.isStalemate() || game.isDraw()) return "stalemate";
    if (game.isCheck()) return "check";
    return "playing";
  } catch {
    return "playing";
  }
}

export function isLegalSuccessor(previousFen: string, newFen: string) {
  if (previousFen === newFen) return false;
  if (!isValidFen(previousFen) || !isValidFen(newFen)) return false;
  const game = new Chess(previousFen);
  return game.moves({ verbose: true }).some((move) => move.after === newFen);
}

export function squareAt(file: number, rank: number): Square {
  return `${FILES[file]}${8 - rank}` as Square;
}

export function lastMoveSquares(prevFen: string, nextFen: string) {
  try {
    const before = new Chess(prevFen);
    const after = new Chess(nextFen);
    const changed: Square[] = [];
    for (const sq of before.board().flatMap((row, r) =>
      row.map((piece, f) => {
        const square = squareAt(f, r);
        const next = after.get(square);
        const same =
          (!piece && !next) ||
          (piece && next && piece.type === next.type && piece.color === next.color);
        return same ? null : square;
      }),
    )) {
      if (sq) changed.push(sq);
    }
    if (changed.length === 2) {
      const [a, b] = changed;
      const aEmpty = !after.get(a);
      return aEmpty ? { from: a, to: b } : { from: b, to: a };
    }
    return null;
  } catch {
    return null;
  }
}
