"use client";

import { Chess, type Square } from "chess.js";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { makeMove } from "@/app/actions/chess";
import { ChessPiece } from "@/components/chess/ChessPiece";
import { MacWindow } from "@/components/system/MacWindow";
import { gameStatus, lastMoveSquares, squareAt, START_FEN, turnFromFen } from "@/lib/chess-core";
import { cn } from "@/lib/cn";
import { parseChessLiveEvent, type ChessSnapshot } from "@/lib/types";

type Props = {
  className?: string;
  initial?: ChessSnapshot;
};

function useChessStream(onEvent: (fen: string, connections: number) => void) {
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;
  const restartRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let source: EventSource | null = null;
    let retry: number | undefined;
    let closed = false;

    const connect = () => {
      if (closed) return;
      source?.close();
      source = new EventSource("/api/chess/stream");
      source.onmessage = (message) => {
        const event = parseChessLiveEvent(message.data);
        if (!event) return;
        onEventRef.current(event.fen, event.connections);
      };
      source.onerror = () => {
        source?.close();
        source = null;
        if (!closed) retry = window.setTimeout(connect, 800);
      };
    };

    restartRef.current = connect;
    connect();

    return () => {
      closed = true;
      restartRef.current = null;
      if (retry) window.clearTimeout(retry);
      source?.close();
    };
  }, []);

  return () => restartRef.current?.();
}

export function ChessTile({ className, initial }: Props) {
  const [fen, setFen] = useState(initial?.fen || START_FEN);
  const [connections, setConnections] = useState(initial?.connections ?? 0);
  const [selected, setSelected] = useState<Square | null>(null);
  const [last, setLast] = useState<{ from: Square; to: Square } | null>(null);
  const [, startTransition] = useTransition();
  const fenRef = useRef(fen);

  useEffect(() => {
    fenRef.current = fen;
  }, [fen]);

  const restartStream = useChessStream((nextFen, nextConnections) => {
    if (nextFen !== fenRef.current) {
      setLast(lastMoveSquares(fenRef.current, nextFen));
      setFen(nextFen);
      setSelected(null);
    }
    setConnections(nextConnections);
  });

  const game = useMemo(() => {
    try {
      return new Chess(fen);
    } catch {
      return new Chess(START_FEN);
    }
  }, [fen]);

  const legal = selected ? game.moves({ verbose: true, square: selected }) : [];
  const turn = turnFromFen(fen);
  const status = gameStatus(fen);
  const turnLabel =
    status === "checkmate"
      ? "Checkmate"
      : status === "stalemate"
        ? "Draw"
        : status === "check"
          ? `${turn === "w" ? "White" : "Black"} in check`
          : `${turn === "w" ? "White" : "Black"} to Move`;

  function onSquare(square: Square) {
    if (game.isGameOver()) return;
    const piece = game.get(square);
    if (selected && legal.some((move) => move.to === square)) {
      const previous = fen;
      const nextGame = new Chess(fen);
      const played = nextGame.move({ from: selected, to: square, promotion: "q" });
      if (!played) return;
      const nextFen = nextGame.fen();
      setLast({ from: selected, to: square });
      setFen(nextFen);
      setSelected(null);
      startTransition(async () => {
        const result = await makeMove(previous, nextFen);
        if (!result.ok) {
          setFen(result.snapshot.fen);
          setConnections(result.snapshot.connections);
        }
        // Server actions abort in-flight EventSource; reopen so later moves arrive.
        restartStream();
      });
      return;
    }
    if (piece && piece.color === game.turn()) {
      setSelected(square);
      return;
    }
    setSelected(null);
  }

  return (
    <MacWindow className={className} title="Chess">
      <div className="flex min-h-0 flex-1 flex-col p-2">
      <div className="mb-1.5 flex items-center justify-between gap-2 text-[11px] tracking-wide text-white/60">
        <span>Turn: {turnLabel}</span>
        <span>Connected: {connections} players</span>
      </div>
      <div className="grid min-h-0 flex-1 place-items-center">
        <div className="aspect-square w-full max-h-full overflow-hidden rounded-lg border border-white/10">
          <div className="grid h-full w-full grid-cols-8 grid-rows-8">
            {Array.from({ length: 64 }, (_, i) => {
              const file = i % 8;
              const rank = Math.floor(i / 8);
              const square = squareAt(file, rank);
              const piece = game.get(square);
              const light = (file + rank) % 2 === 0;
              const isSelected = selected === square;
              const isTarget = legal.some((move) => move.to === square);
              const isLast = last && (last.from === square || last.to === square);
              return (
                <button
                  key={square}
                  type="button"
                  onClick={() => onSquare(square)}
                  className={cn(
                    "relative grid place-items-center",
                    light ? "bg-neutral-200/90" : "bg-neutral-800/90",
                    isSelected && "ring-2 ring-[#0a84ff] ring-inset",
                    isLast && "after:absolute after:inset-1 after:rounded-sm after:bg-[#0a84ff]/30",
                  )}
                >
                  {isTarget ? (
                    <span
                      className={cn(
                        "absolute h-2.5 w-2.5 rounded-full",
                        piece ? "h-4 w-4 border-2 border-[#0a84ff] bg-transparent" : "bg-[#0a84ff]/80",
                      )}
                    />
                  ) : null}
                  {isLast && last.to === square ? (
                    <span className="pointer-events-none absolute h-3 w-3 rotate-45 bg-[#0a84ff]/80 blur-[1px]" />
                  ) : null}
                  {piece ? (
                    <ChessPiece type={piece.type} color={piece.color} className="relative z-[1] h-[78%] w-[78%]" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      </div>
    </MacWindow>
  );
}
