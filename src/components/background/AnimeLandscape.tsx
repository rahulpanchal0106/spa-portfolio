import Image from "next/image";

export function AnimeLandscape() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <Image
        src="/anime-field.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[center_42%]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/35 via-neutral-950/10 to-neutral-950/50" />
      <div className="absolute inset-0 bg-neutral-950/25" />
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <g className="cloud" opacity="0.45">
          <ellipse cx="240" cy="110" rx="160" ry="42" fill="#f7f1e4" />
          <ellipse cx="330" cy="96" rx="110" ry="36" fill="#fffaf0" />
        </g>
        <g className="cloud-slow" opacity="0.38">
          <ellipse cx="980" cy="150" rx="190" ry="46" fill="#f4ead8" />
          <ellipse cx="1080" cy="138" rx="120" ry="34" fill="#fff6e8" />
        </g>
      </svg>
    </div>
  );
}
