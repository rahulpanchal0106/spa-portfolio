"use client";

import { motion } from "framer-motion";
import { site } from "@/lib/site";
import { cn } from "@/lib/cn";

export const socialItems = [
  {
    href: site.github,
    label: "GitHub",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
        <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.71.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.46-1.2-1.12-1.52-1.12-1.52-.92-.64.07-.63.07-.63 1.02.07 1.56 1.07 1.56 1.07.9 1.58 2.36 1.12 2.94.86.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05A9.3 9.3 0 0 1 12 6.84c.85 0 1.7.12 2.5.35 1.9-1.32 2.74-1.05 2.74-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.03 10.03 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" />
      </svg>
    ),
  },
  {
    href: site.linkedin,
    label: "LinkedIn",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
        <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.24 8.25h4.52V24H.24V8.25zM8.34 8.25h4.33v2.14h.06c.6-1.14 2.08-2.34 4.28-2.34 4.58 0 5.42 3.01 5.42 6.93V24h-4.52v-7.79c0-1.86-.03-4.25-2.59-4.25-2.59 0-2.99 2.02-2.99 4.11V24H8.34V8.25z" />
      </svg>
    ),
  },
  {
    href: site.twitter,
    label: "Twitter / X",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
        <path d="M18.24 2H21.5l-7.5 8.57L22.75 22h-6.56l-5.14-6.72L5.6 22H2.32l8.02-9.16L1.5 2h6.72l4.64 6.15L18.24 2Zm-1.15 18.08h1.82L7.07 3.82H5.12l11.97 16.26Z" />
      </svg>
    ),
  },
  {
    href: `mailto:${site.email}`,
    label: "Email",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    ),
  },
] as const;

export function SocialLinks({ className }: { className?: string }) {
  return (
    <nav aria-label="Social" className={cn("flex items-center gap-3", className)}>
      {socialItems.map((item) => (
        <motion.a
          key={item.label}
          href={item.href}
          target={item.href.startsWith("mailto:") ? undefined : "_blank"}
          rel={item.href.startsWith("mailto:") ? undefined : "noreferrer"}
          aria-label={item.label}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.94 }}
          className="text-white/55 transition-colors hover:text-[#64d2ff]"
        >
          {item.icon}
        </motion.a>
      ))}
    </nav>
  );
}
