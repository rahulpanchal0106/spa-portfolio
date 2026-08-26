import type { PieceSymbol } from "chess.js";

export function ChessPiece({
  type,
  color,
  className,
}: {
  type: PieceSymbol;
  color: "w" | "b";
  className?: string;
}) {
  return (
    <svg viewBox="0 0 45 45" className={className} aria-hidden>
      <g
        fill={color === "w" ? "#e7e5e4" : "#171717"}
        stroke={color === "w" ? "#262626" : "#d4d4d4"}
        strokeWidth="1.4"
        strokeLinejoin="round"
      >
        {type === "p" ? (
          <path d="M22.5 9c-2.2 0-4 1.8-4 4 0 1.2.5 2.2 1.3 3-3 1.2-5.3 4.2-5.3 7.7 0 1.4.4 2.7 1.1 3.8-3.3 1.4-5.6 4.7-5.6 8.5h25c0-3.8-2.3-7.1-5.6-8.5.7-1.1 1.1-2.4 1.1-3.8 0-3.5-2.3-6.5-5.3-7.7.8-.8 1.3-1.8 1.3-3 0-2.2-1.8-4-4-4z" />
        ) : null}
        {type === "r" ? (
          <>
            <path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" />
            <path d="M34 14H11c0 7 1 13 3 16h17c2-3 3-9 3-16z" />
            <path d="M11 14h23" fill="none" />
          </>
        ) : null}
        {type === "n" ? (
          <path d="M22 10c-1 4-7 7-8 12-1 3 1 5 1 5l-4 3c0 0-1 3 2 4 0 0-5 3-2 7h22s2-3 0-7c3-1 2-5 0-6-2-1-3-3-2-6 1-4-4-8-9-12z" />
        ) : null}
        {type === "b" ? (
          <>
            <path d="M9 36c3.4-1 15.4-1 18.8 0 2 0 1.5-1 0-2-1.9-1.3-8.4-1.3-10.3 0-1.4 1-1.1 2 .3 2z" />
            <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5-1-2-1-2 0-3-4.5-8.5-4.5-13.5 0-2-1.5-3-3-3s-3 1-3 3C18.5 21.5 14 27 14 30c0 0-1.5.5-1 2z" />
            <circle cx="22.5" cy="8" r="2.2" />
            <path d="M17.5 26h10M20 22.5l5 6" fill="none" />
          </>
        ) : null}
        {type === "q" ? (
          <>
            <circle cx="6" cy="12" r="2.2" />
            <circle cx="14" cy="7" r="2.2" />
            <circle cx="22.5" cy="5" r="2.2" />
            <circle cx="31" cy="7" r="2.2" />
            <circle cx="39" cy="12" r="2.2" />
            <path d="M9 26c8-12 19-12 27 0-3 2-6 3-13.5 3S12 28 9 26z" />
            <path d="M9 26c0 0 2 11 13.5 11S36 26 36 26" fill="none" />
            <path d="M11.5 37h22v3h-22z" />
          </>
        ) : null}
        {type === "k" ? (
          <>
            <path d="M22.5 11V6" fill="none" strokeWidth="2" />
            <path d="M20 8.5h5" fill="none" strokeWidth="2" />
            <circle cx="22.5" cy="14" r="2.4" />
            <path d="M10 28c.5-6 5-10.5 12.5-10.5S34.5 22 35 28c-3 1.5-7 2.5-12.5 2.5S13 29.5 10 28z" />
            <path d="M11 36.5h23" fill="none" />
            <path d="M12.5 38.5h20v2.5h-20z" />
          </>
        ) : null}
      </g>
    </svg>
  );
}
