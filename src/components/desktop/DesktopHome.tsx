"use client";

import { useState, type ReactNode } from "react";
import {
  useDesktopMode,
  type FinderSection,
  type WindowAppId,
} from "@/components/desktop/DesktopModeProvider";
import { WallpaperPicker } from "@/components/system/WallpaperPicker";

type HomeApp = {
  id: WindowAppId;
  label: string;
  icon: ReactNode;
};

type FinderShortcut = {
  id: FinderSection;
  label: string;
  icon: ReactNode;
};

const APPS: HomeApp[] = [
  {
    id: "finder",
    label: "Finder",
    icon: (
      <svg viewBox="0 0 64 64" className="h-11 w-11" aria-hidden>
        <rect width="64" height="64" rx="14" fill="#1a7ff0" />
        <path d="M18 38c6-14 22-18 28-8" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="26" cy="26" r="3.2" fill="#fff" />
        <circle cx="40" cy="28" r="3.2" fill="#fff" />
        <path d="M22 44c4 4 16 4 20 0" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "systems",
    label: "Systems",
    icon: (
      <svg viewBox="0 0 64 64" className="h-11 w-11" aria-hidden>
        <rect width="64" height="64" rx="14" fill="#2c2c2e" />
        <rect x="12" y="16" width="40" height="28" rx="3" fill="#64d2ff" />
        <rect x="16" y="20" width="18" height="8" rx="1.5" fill="#0a84ff" />
        <rect x="16" y="31" width="12" height="3" rx="1" fill="#fff" opacity="0.7" />
        <rect x="16" y="36" width="20" height="3" rx="1" fill="#fff" opacity="0.45" />
        <rect x="24" y="46" width="16" height="3" rx="1" fill="#8e8e93" />
      </svg>
    ),
  },
  {
    id: "ask",
    label: "Ask",
    icon: (
      <svg viewBox="0 0 64 64" className="h-11 w-11" aria-hidden>
        <rect width="64" height="64" rx="14" fill="#30d158" />
        <path
          d="M18 22h28a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4H30l-8 7v-7h-4a4 4 0 0 1-4-4V26a4 4 0 0 1 4-4Z"
          fill="#fff"
        />
        <circle cx="28" cy="33" r="2.2" fill="#30d158" />
        <circle cx="36" cy="33" r="2.2" fill="#30d158" />
      </svg>
    ),
  },
  {
    id: "mail",
    label: "Mail",
    icon: (
      <svg viewBox="0 0 64 64" className="h-11 w-11" aria-hidden>
        <rect width="64" height="64" rx="14" fill="#0a84ff" />
        <rect x="12" y="18" width="40" height="28" rx="4" fill="#fff" />
        <path d="M14 22 32 36 50 22" fill="none" stroke="#0a84ff" strokeWidth="3" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const FINDER_SHORTCUTS: FinderShortcut[] = [
  {
    id: "projects",
    label: "Projects",
    icon: (
      <svg viewBox="0 0 64 64" className="h-11 w-11" aria-hidden>
        <rect width="64" height="64" rx="14" fill="#1c1c1e" />
        <path
          d="M14 24.5c0-2.5 2-4.5 4.5-4.5h7.2c1.1 0 2.1.4 2.8 1.2l1.6 1.8H46c2.5 0 4.5 2 4.5 4.5V42c0 2.5-2 4.5-4.5 4.5H18.5C16 46.5 14 44.5 14 42V24.5Z"
          fill="#5ac8fa"
        />
        <path d="M14 28h36" stroke="#2a9fd6" strokeWidth="2" opacity="0.55" />
      </svg>
    ),
  },
  {
    id: "resume",
    label: "Resume",
    icon: (
      <svg viewBox="0 0 64 64" className="h-11 w-11" aria-hidden>
        <rect width="64" height="64" rx="14" fill="#3a3a3c" />
        <path d="M20 12h16l12 12v28c0 2.2-1.8 4-4 4H20c-2.2 0-4-1.8-4-4V16c0-2.2 1.8-4 4-4Z" fill="#f2f2f7" />
        <path d="M36 12 48 24H40c-2.2 0-4-1.8-4-4V12Z" fill="#c7c7cc" />
        <path d="M24 32h16M24 38h12M24 44h14" stroke="#8e8e93" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "experience",
    label: "Experience",
    icon: (
      <svg viewBox="0 0 64 64" className="h-11 w-11" aria-hidden>
        <rect width="64" height="64" rx="14" fill="#2c2c2e" />
        <path
          d="M22 22v-3c0-2.8 2.2-5 5-5h10c2.8 0 5 2.2 5 5v3h8c2.2 0 4 1.8 4 4v22c0 2.2-1.8 4-4 4H14c-2.2 0-4-1.8-4-4V26c0-2.2 1.8-4 4-4h8Z"
          fill="#bf5af2"
        />
        <path d="M24 22h16v-2.5c0-1.4-1.1-2.5-2.5-2.5h-11c-1.4 0-2.5 1.1-2.5 2.5V22Z" fill="#e4b8ff" />
        <rect x="28" y="34" width="8" height="4" rx="2" fill="#fff" opacity="0.85" />
      </svg>
    ),
  },
  {
    id: "skills",
    label: "Skills",
    icon: (
      <svg viewBox="0 0 64 64" className="h-11 w-11" aria-hidden>
        <rect width="64" height="64" rx="14" fill="#2c2c2e" />
        <path
          d="M32 12 36.8 24.2 50 26.2 40.4 35.4 42.8 48.6 32 42.4 21.2 48.6 23.6 35.4 14 26.2 27.2 24.2 32 12Z"
          fill="#ffd60a"
        />
      </svg>
    ),
  },
];

function HomeIconButton({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="desktop-home-icon group flex w-[5.5rem] flex-col items-center gap-1.5"
      onClick={onClick}
    >
      <span className="desktop-home-glyph grid place-items-center rounded-[18px] shadow-[0_10px_28px_rgb(0_0_0_/_0.35)] transition group-hover:scale-[1.04] group-active:scale-[0.98]">
        {icon}
      </span>
      <span className="rounded-md bg-black/35 px-1.5 py-0.5 text-center text-[11px] font-medium text-white/95 backdrop-blur-sm">
        {label}
      </span>
    </button>
  );
}

export function DesktopHome() {
  const { openSolo, openFinder, showCluster } = useDesktopMode();
  const [trashOpen, setTrashOpen] = useState(false);

  return (
    <div className="desktop-home pointer-events-none absolute inset-0 z-20 p-8 pt-14">
      <div className="pointer-events-auto absolute top-14 left-8 flex flex-col items-center gap-5">
        <div className="desktop-home-icon flex w-[5.5rem] flex-col items-center gap-1.5">
          <WallpaperPicker
            align="left"
            variant="desktop"
            trigger={
              <span className="desktop-home-glyph grid place-items-center rounded-[18px] shadow-[0_10px_28px_rgb(0_0_0_/_0.35)] transition hover:scale-[1.04] active:scale-[0.98]">
                <svg viewBox="0 0 64 64" className="h-11 w-11" aria-hidden>
                  <rect width="64" height="64" rx="14" fill="#636366" />
                  <rect x="10" y="14" width="44" height="32" rx="4" fill="#d1d1d6" />
                  <path
                    d="M10 38 24 26l10 9 8-7 12 10"
                    fill="none"
                    stroke="#636366"
                    strokeWidth="3"
                    strokeLinejoin="round"
                  />
                  <circle cx="20" cy="22" r="3.5" fill="#ffd60a" />
                  <rect x="22" y="50" width="20" height="3" rx="1.5" fill="#8e8e93" />
                </svg>
              </span>
            }
          />
          <span className="rounded-md bg-black/35 px-1.5 py-0.5 text-center text-[11px] font-medium text-white/95 backdrop-blur-sm">
            Wallpaper
          </span>
        </div>

        <HomeIconButton
          label="All Windows"
          icon={
            <svg viewBox="0 0 64 64" className="h-11 w-11" aria-hidden>
              <rect width="64" height="64" rx="14" fill="#3a3a3c" />
              <rect x="10" y="14" width="28" height="20" rx="3" fill="#64d2ff" />
              <rect x="26" y="24" width="28" height="20" rx="3" fill="#0a84ff" />
              <rect x="14" y="36" width="22" height="14" rx="2.5" fill="#d1d1d6" />
            </svg>
          }
          onClick={showCluster}
        />

        <HomeIconButton
          label="Trash"
          icon={
            <svg viewBox="0 0 64 64" className="h-11 w-11" aria-hidden>
              <rect width="64" height="64" rx="14" fill="#48484a" />
              <path
                d="M22 20h20l-1.2 28.5c-.1 1.9-1.7 3.5-3.6 3.5H26.8c-1.9 0-3.5-1.6-3.6-3.5L22 20Z"
                fill="#d1d1d6"
              />
              <path d="M20 20h24" stroke="#aeaeb2" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M28 16.5h8c.8 0 1.5.7 1.5 1.5v2h-11v-2c0-.8.7-1.5 1.5-1.5Z" fill="#8e8e93" />
              <path
                d="M28 28v16M32 28v16M36 28v16"
                stroke="#8e8e93"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          }
          onClick={() => setTrashOpen(true)}
        />
      </div>

      {trashOpen ? (
        <div className="pointer-events-auto absolute inset-0 z-30 flex items-center justify-center p-6">
          <button
            type="button"
            className="absolute inset-0 bg-black/10"
            aria-label="Close Trash"
            onClick={() => setTrashOpen(false)}
          />
          <div className="mac-window relative z-10 flex h-[min(420px,70vh)] w-full max-w-md flex-col">
            <header className="mac-titlebar">
              <div className="mac-traffic">
                <button
                  type="button"
                  className="mac-dot close"
                  aria-label="Close"
                  onClick={() => setTrashOpen(false)}
                />
                <button
                  type="button"
                  className="mac-dot min"
                  aria-label="Minimize"
                  onClick={() => setTrashOpen(false)}
                />
                <span className="mac-dot max" />
              </div>
              <p className="mac-title">Trash</p>
            </header>
            <div className="mac-body grid flex-1 place-items-center p-6 text-center">
              <div>
                <svg viewBox="0 0 64 64" className="mx-auto mb-3 h-14 w-14 opacity-80" aria-hidden>
                  <path
                    d="M22 20h20l-1.2 28.5c-.1 1.9-1.7 3.5-3.6 3.5H26.8c-1.9 0-3.5-1.6-3.6-3.5L22 20Z"
                    fill="#d1d1d6"
                  />
                  <path d="M20 20h24" stroke="#aeaeb2" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M28 16.5h8c.8 0 1.5.7 1.5 1.5v2h-11v-2c0-.8.7-1.5 1.5-1.5Z" fill="#8e8e93" />
                </svg>
                <p className="text-[15px] font-medium text-white/90">Trash is Empty</p>
                <p className="mt-1 text-[12px] text-white/45">Items you delete will appear here.</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="pointer-events-auto absolute top-14 right-8 flex items-start gap-4">
        <div className="flex flex-col items-center gap-5">
          {FINDER_SHORTCUTS.map((item) => (
            <HomeIconButton
              key={item.id}
              label={item.label}
              icon={item.icon}
              onClick={() => openFinder(item.id)}
            />
          ))}
        </div>

        <div className="flex flex-col items-center gap-5">
          {APPS.map((app) => (
            <HomeIconButton
              key={app.id}
              label={app.label}
              icon={app.icon}
              onClick={() => (app.id === "finder" ? openFinder() : openSolo(app.id))}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
