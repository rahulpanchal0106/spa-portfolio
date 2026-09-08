import type { ReactNode } from "react";

export type SkillIcon = {
  id: string;
  name: string;
  icon: ReactNode;
};

function Svg({ children, title }: { children: ReactNode; title: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden fill="currentColor">
      <title>{title}</title>
      {children}
    </svg>
  );
}

/** Compact menubar set — most important stack signals only. */
export const menubarSkills: SkillIcon[] = [
  {
    id: "react",
    name: "React",
    icon: (
      <Svg title="React">
        <circle cx="12" cy="12" r="2.1" />
        <ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="currentColor" strokeWidth="1.35" />
        <ellipse
          cx="12"
          cy="12"
          rx="10"
          ry="4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.35"
          transform="rotate(60 12 12)"
        />
        <ellipse
          cx="12"
          cy="12"
          rx="10"
          ry="4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.35"
          transform="rotate(120 12 12)"
        />
      </Svg>
    ),
  },
  {
    id: "next",
    name: "Next.js",
    icon: (
      <Svg title="Next.js">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8.2 7.4h1.55v6.55l5.9-6.55H17.4v9.2h-1.55V10.1l-5.95 6.5H8.2V7.4Z" />
      </Svg>
    ),
  },
  {
    id: "ts",
    name: "TypeScript",
    icon: (
      <Svg title="TypeScript">
        <rect
          x="2.5"
          y="2.5"
          width="19"
          height="19"
          rx="2.25"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <text
          x="12"
          y="16.2"
          textAnchor="middle"
          fill="currentColor"
          fontSize="9.5"
          fontWeight="700"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          letterSpacing="-0.04em"
        >
          TS
        </text>
      </Svg>
    ),
  },
  {
    id: "node",
    name: "Node.js",
    icon: (
      <Svg title="Node.js">
        <path
          d="M12 1.8 20.2 6.5v9L12 20.2 3.8 15.5v-9L12 1.8Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.55"
          strokeLinejoin="round"
        />
        <text
          x="12"
          y="14.6"
          textAnchor="middle"
          fill="currentColor"
          fontSize="8.5"
          fontWeight="700"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          letterSpacing="-0.06em"
        >
          JS
        </text>
      </Svg>
    ),
  },
  {
    id: "mongo",
    name: "MongoDB",
    icon: (
      <Svg title="MongoDB">
        <path d="M12.35 2.2s3.6 3.1 3.6 8.2c0 3.6-1.7 5.5-3 6.5l-.55 3.4h-.9l-.5-3.4c-1.25-1-2.95-2.9-2.95-6.5 0-5.1 3.55-8.2 3.55-8.2h.75Z" />
        <path d="M12 4.2v14.2" fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="0.9" />
      </Svg>
    ),
  },
  {
    id: "aws",
    name: "AWS",
    icon: (
      <Svg title="AWS">
        {/* AWS smile mark only — readable at menubar size */}
        <path
          d="M3.2 14.2c3.1 2.9 7 4.4 11.2 4.4 2.6 0 5-.6 7.1-1.65"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <path
          d="M18.6 13.7 21.5 16.2l-2.85 1.55"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text
          x="12"
          y="11.2"
          textAnchor="middle"
          fill="currentColor"
          fontSize="7.5"
          fontWeight="700"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          letterSpacing="0.02em"
        >
          aws
        </text>
      </Svg>
    ),
  },
  {
    id: "redis",
    name: "Redis",
    icon: (
      <Svg title="Redis">
        <ellipse cx="12" cy="7.2" rx="8.2" ry="3.1" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <path
          d="M3.8 7.2v3.4c0 1.7 3.7 3.1 8.2 3.1s8.2-1.4 8.2-3.1V7.2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path
          d="M3.8 10.6v3.4c0 1.7 3.7 3.1 8.2 3.1s8.2-1.4 8.2-3.1v-3.4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        />
      </Svg>
    ),
  },
];
