"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ChatTile } from "@/components/chat/ChatTile";
import { ContactForm } from "@/components/contact/ContactForm";
import { useWallpaper } from "@/components/background/WallpaperProvider";
import type { FinderSection } from "@/components/desktop/DesktopModeProvider";
import { FeaturedWorkWidget } from "@/components/mobile/FeaturedWorkWidget";
import { FolderGrid } from "@/components/folders/FolderGrid";
import { ProjectDetail } from "@/components/folders/ProjectDetail";
import { SystemsOverviewCarousel } from "@/components/spotlight/SystemsOverview";
import { WallpaperShuffleIcon, useShuffleWallpaper } from "@/components/system/WallpaperShuffleButton";
import { SocialLinks } from "@/components/system/SocialLinks";
import { cn } from "@/lib/cn";
import { resume } from "@/lib/profile";
import { projects } from "@/lib/projects";
import { site, skillGroups } from "@/lib/site";

type MobileApp =
  | { kind: "finder"; section: FinderSection }
  | { kind: "ask" }
  | { kind: "mail" }
  | { kind: "systems" }
  | { kind: "wallpaper" }
  | { kind: "trash" }
  | { kind: "about" }
  | { kind: "project"; id: string };

type IconItem = {
  id: string;
  label: string;
  icon: ReactNode;
  onOpen: () => void;
};

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"] as const;

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function isRemote(src: string) {
  return /^https?:\/\//i.test(src);
}

function FinderIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden>
      <rect width="64" height="64" rx="14" fill="#1a7ff0" />
      <path d="M18 38c6-14 22-18 28-8" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="26" cy="26" r="3.2" fill="#fff" />
      <circle cx="40" cy="28" r="3.2" fill="#fff" />
      <path d="M22 44c4 4 16 4 20 0" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function AskIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden>
      <rect width="64" height="64" rx="14" fill="#30d158" />
      <path
        d="M18 22h28a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4H30l-8 7v-7h-4a4 4 0 0 1-4-4V26a4 4 0 0 1 4-4Z"
        fill="#fff"
      />
      <circle cx="28" cy="33" r="2.2" fill="#30d158" />
      <circle cx="36" cy="33" r="2.2" fill="#30d158" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden>
      <rect width="64" height="64" rx="14" fill="#0a84ff" />
      <rect x="12" y="18" width="40" height="28" rx="4" fill="#fff" />
      <path d="M14 22 32 36 50 22" fill="none" stroke="#0a84ff" strokeWidth="3" strokeLinejoin="round" />
    </svg>
  );
}

function SystemsIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden>
      <rect width="64" height="64" rx="14" fill="#2c2c2e" />
      <rect x="12" y="16" width="40" height="28" rx="3" fill="#64d2ff" />
      <rect x="16" y="20" width="18" height="8" rx="1.5" fill="#0a84ff" />
      <rect x="16" y="31" width="12" height="3" rx="1" fill="#fff" opacity="0.7" />
      <rect x="16" y="36" width="20" height="3" rx="1" fill="#fff" opacity="0.45" />
      <rect x="24" y="46" width="16" height="3" rx="1" fill="#8e8e93" />
    </svg>
  );
}

function ProjectsIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden>
      <rect width="64" height="64" rx="14" fill="#1c1c1e" />
      <path
        d="M14 24.5c0-2.5 2-4.5 4.5-4.5h7.2c1.1 0 2.1.4 2.8 1.2l1.6 1.8H46c2.5 0 4.5 2 4.5 4.5V42c0 2.5-2 4.5-4.5 4.5H18.5C16 46.5 14 44.5 14 42V24.5Z"
        fill="#5ac8fa"
      />
      <path d="M14 28h36" stroke="#2a9fd6" strokeWidth="2" opacity="0.55" />
    </svg>
  );
}

function ResumeIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden>
      <rect width="64" height="64" rx="14" fill="#3a3a3c" />
      <path d="M20 12h16l12 12v28c0 2.2-1.8 4-4 4H20c-2.2 0-4-1.8-4-4V16c0-2.2 1.8-4 4-4Z" fill="#f2f2f7" />
      <path d="M36 12 48 24H40c-2.2 0-4-1.8-4-4V12Z" fill="#c7c7cc" />
      <path d="M24 32h16M24 38h12M24 44h14" stroke="#8e8e93" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function ExperienceIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden>
      <rect width="64" height="64" rx="14" fill="#2c2c2e" />
      <path
        d="M22 22v-3c0-2.8 2.2-5 5-5h10c2.8 0 5 2.2 5 5v3h8c2.2 0 4 1.8 4 4v22c0 2.2-1.8 4-4 4H14c-2.2 0-4-1.8-4-4V26c0-2.2 1.8-4 4-4h8Z"
        fill="#bf5af2"
      />
      <path d="M24 22h16v-2.5c0-1.4-1.1-2.5-2.5-2.5h-11c-1.4 0-2.5 1.1-2.5 2.5V22Z" fill="#e4b8ff" />
      <rect x="28" y="34" width="8" height="4" rx="2" fill="#fff" opacity="0.85" />
    </svg>
  );
}

function SkillsIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden>
      <rect width="64" height="64" rx="14" fill="#2c2c2e" />
      <path
        d="M32 12 36.8 24.2 50 26.2 40.4 35.4 42.8 48.6 32 42.4 21.2 48.6 23.6 35.4 14 26.2 27.2 24.2 32 12Z"
        fill="#ffd60a"
      />
    </svg>
  );
}

function WallpaperIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden>
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
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden>
      <rect width="64" height="64" rx="14" fill="#48484a" />
      <path
        d="M22 20h20l-1.2 28.5c-.1 1.9-1.7 3.5-3.6 3.5H26.8c-1.9 0-3.5-1.6-3.6-3.5L22 20Z"
        fill="#d1d1d6"
      />
      <path d="M20 20h24" stroke="#aeaeb2" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M28 16.5h8c.8 0 1.5.7 1.5 1.5v2h-11v-2c0-.8.7-1.5 1.5-1.5Z" fill="#8e8e93" />
      <path d="M28 28v16M32 28v16M36 28v16" stroke="#8e8e93" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function AboutIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden>
      <rect width="64" height="64" rx="14" fill="#5e5ce6" />
      <circle cx="32" cy="24" r="9" fill="#fff" />
      <path d="M14 52c2.5-11 12-16 18-16s15.5 5 18 16" fill="#fff" />
    </svg>
  );
}

function AboutRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-white/8 py-2.5 last:border-b-0">
      <span className="shrink-0 text-[13px] text-white/45">{label}</span>
      <span className="text-right text-[13px] font-medium text-white/90">{value}</span>
    </div>
  );
}

function AboutSheet() {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-auto">
      <div className="mb-5 flex flex-col items-center text-center">
        <div className="mb-3 h-[4.5rem] w-[4.5rem] overflow-hidden rounded-[1.35rem] shadow-[0_10px_28px_rgb(0_0_0_/_0.35)]">
          <AboutIcon />
        </div>
        <h1 className="text-[22px] font-bold tracking-tight text-white">{site.name}</h1>
        <p className="mt-1 text-[14px] text-white/60">{site.role}</p>
      </div>

      <div className="mb-4 rounded-2xl bg-white/6 px-4">
        <AboutRow label="Name" value={site.name} />
        <AboutRow label="Role" value={site.role} />
        <AboutRow label="Location" value={site.location} />
        <AboutRow label="Email" value={site.email} />
      </div>

      <div className="mb-4 rounded-2xl bg-white/6 px-4 py-3">
        <p className="text-[11px] font-semibold tracking-wide text-white/40 uppercase">Overview</p>
        <p className="mt-2 text-[14px] leading-relaxed text-white/85">{resume.headline}</p>
        <p className="mt-2 text-[13px] leading-relaxed text-white/65">{resume.blurb}</p>
      </div>

      <div className="mb-4 rounded-2xl bg-white/6 px-4 py-3">
        <p className="text-[11px] font-semibold tracking-wide text-white/40 uppercase">Highlights</p>
        <ul className="mt-2 space-y-2">
          {resume.highlights.map((item) => (
            <li key={item} className="flex gap-2 text-[13px] leading-relaxed text-white/80">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#5e5ce6]" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-4 rounded-2xl bg-white/6 px-4 py-3">
        <p className="text-[11px] font-semibold tracking-wide text-white/40 uppercase">Stack</p>
        <div className="mt-2 space-y-3">
          {skillGroups.map((group) => (
            <div key={group.label}>
              <p className="mb-1.5 text-[12px] font-medium text-white/50">{group.label}</p>
              <div className="flex flex-wrap gap-1.5">
                {group.items.map((skill) => (
                  <span key={skill} className="rounded-md bg-white/8 px-2 py-1 text-[12px] text-white/85">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4 rounded-2xl bg-white/6 px-4 py-3">
        <p className="text-[11px] font-semibold tracking-wide text-white/40 uppercase">Looking for</p>
        <p className="mt-2 text-[13px] leading-relaxed text-white/75">{resume.lookingFor}</p>
      </div>

      <div className="rounded-2xl bg-white/6 px-4 py-3">
        <p className="mb-2 text-[11px] font-semibold tracking-wide text-white/40 uppercase">Links</p>
        <SocialLinks />
      </div>
    </div>
  );
}

function useMobileClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const time = now ? `${pad(now.getHours())}:${pad(now.getMinutes())}` : "--:--";
  const day = now
    ? `${WEEKDAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()}`
    : "——————";

  return { time, day };
}

function HomeIcon({ label, icon, onClick }: { label: string; icon: ReactNode; onClick: () => void }) {
  return (
    <button type="button" className="mobile-home-icon flex flex-col items-center gap-1.5" onClick={onClick}>
      <span className="mobile-home-glyph h-[3.85rem] w-[3.85rem] overflow-hidden rounded-[1.15rem] shadow-[0_8px_20px_rgb(0_0_0_/_0.35)]">
        {icon}
      </span>
      <span className="max-w-[4.6rem] truncate text-center text-[11px] font-medium text-white drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.65)]">
        {label}
      </span>
    </button>
  );
}

function AppSheet({
  title,
  onClose,
  children,
  hideTitle = false,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  hideTitle?: boolean;
}) {
  return (
    <div className="mobile-app-sheet fixed inset-0 z-50 flex flex-col bg-[#1c1c1e] pt-[env(safe-area-inset-top)]">
      <header className="flex shrink-0 items-center gap-3 px-3 py-2.5">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-0.5 text-[17px] font-medium text-[#0a84ff]"
        >
          <svg viewBox="0 0 16 16" className="h-5 w-5" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M10 3.5 5.5 8 10 12.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Home
        </button>
        {!hideTitle ? (
          <p className="min-w-0 flex-1 truncate text-center text-[17px] font-semibold text-white/90">{title}</p>
        ) : (
          <span className="flex-1" aria-hidden />
        )}
        <span className="w-[4.5rem]" aria-hidden />
      </header>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        {children}
      </div>
    </div>
  );
}

function WallpaperSheet({ onPicked }: { onPicked: () => void }) {
  const { src, wallpapers, loading, setWallpaper, refreshWallpapers } = useWallpaper();

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-[13px] text-white/55">Choose a background</p>
        <button
          type="button"
          onClick={refreshWallpapers}
          disabled={loading}
          className="rounded-full bg-white/10 px-3 py-1.5 text-[12px] font-medium text-white/80 disabled:opacity-40"
        >
          {loading ? "Loading…" : "Shuffle"}
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-auto">
        {wallpapers.length === 0 ? (
          <p className="text-[13px] text-white/55">{loading ? "Fetching wallpapers…" : "Couldn’t load wallpaper feed"}</p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {wallpapers.map((paper) => {
              const active = paper.src === src;
              return (
                <button
                  key={paper.id}
                  type="button"
                  title={paper.label}
                  onClick={() => {
                    setWallpaper(paper.src);
                    onPicked();
                  }}
                  className={cn(
                    "overflow-hidden rounded-2xl border text-left",
                    active ? "border-[#0a84ff] ring-1 ring-[#0a84ff]/50" : "border-white/10",
                  )}
                >
                  <span className="relative block aspect-video bg-black/40">
                    <Image
                      src={paper.src}
                      alt=""
                      fill
                      sizes="160px"
                      unoptimized={paper.live || isRemote(paper.src)}
                      className="object-cover"
                    />
                  </span>
                  <span className="block truncate px-2.5 py-2 text-[12px] text-white/75">{paper.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function TrashSheet() {
  return (
    <div className="grid h-full place-items-center p-6 text-center">
      <div>
        <div className="mx-auto mb-3 h-16 w-16">
          <TrashIcon />
        </div>
        <p className="text-[17px] font-semibold text-white/90">Trash is Empty</p>
        <p className="mt-1 text-[13px] text-white/45">Items you delete will appear here.</p>
      </div>
    </div>
  );
}

export function MobileHome() {
  const { time, day } = useMobileClock();
  const [page, setPage] = useState(0);
  const [app, setApp] = useState<MobileApp | null>(null);
  const [finderSection, setFinderSection] = useState<FinderSection>("projects");
  const scrollerRef = useRef<HTMLDivElement>(null);
  const appOpenRef = useRef(false);
  const historyPushedRef = useRef(false);
  const shuffleWallpaper = useShuffleWallpaper();

  useEffect(() => {
    appOpenRef.current = app !== null;
  }, [app]);

  const closeApp = useCallback(() => {
    if (historyPushedRef.current) {
      historyPushedRef.current = false;
      window.history.back();
      setApp(null);
      return;
    }
    setApp(null);
  }, []);

  const openApp = useCallback((next: MobileApp) => {
    if (!appOpenRef.current && !historyPushedRef.current) {
      window.history.pushState({ mobileApp: true }, "");
      historyPushedRef.current = true;
    }
    setApp(next);
  }, []);

  function openFinder(section: FinderSection = "projects") {
    setFinderSection(section);
    openApp({ kind: "finder", section });
  }

  const page1: IconItem[] = [
    { id: "finder", label: "Finder", icon: <FinderIcon />, onOpen: () => openFinder("projects") },
    { id: "projects", label: "Projects", icon: <ProjectsIcon />, onOpen: () => openFinder("projects") },
    { id: "resume", label: "Resume", icon: <ResumeIcon />, onOpen: () => openFinder("resume") },
    { id: "about", label: "About", icon: <AboutIcon />, onOpen: () => openApp({ kind: "about" }) },
  ];

  const page2: IconItem[] = [
    { id: "experience", label: "Experience", icon: <ExperienceIcon />, onOpen: () => openFinder("experience") },
    { id: "skills", label: "Skills", icon: <SkillsIcon />, onOpen: () => openFinder("skills") },
    { id: "wallpaper", label: "Wallpaper", icon: <WallpaperIcon />, onOpen: () => openApp({ kind: "wallpaper" }) },
    { id: "shuffle", label: "Shuffle", icon: <WallpaperShuffleIcon className="h-full w-full" />, onOpen: () => void shuffleWallpaper() },
    { id: "trash", label: "Trash", icon: <TrashIcon />, onOpen: () => openApp({ kind: "trash" }) },
  ];

  const dock: IconItem[] = [
    { id: "ask", label: "Ask", icon: <AskIcon />, onOpen: () => openApp({ kind: "ask" }) },
    { id: "mail", label: "Contact", icon: <MailIcon />, onOpen: () => openApp({ kind: "mail" }) },
    { id: "systems", label: "Systems", icon: <SystemsIcon />, onOpen: () => openApp({ kind: "systems" }) },
  ];

  useEffect(() => {
    const node = scrollerRef.current;
    if (!node) return;
    const onScroll = () => {
      const next = Math.round(node.scrollLeft / Math.max(node.clientWidth, 1));
      setPage(next);
    };
    node.addEventListener("scroll", onScroll, { passive: true });
    return () => node.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onPopState = () => {
      historyPushedRef.current = false;
      setApp(null);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (!app) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeApp();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [app, closeApp]);

  const activeProject =
    app?.kind === "project" ? projects.find((project) => project.id === app.id) ?? null : null;

  const sheetTitle =
    app?.kind === "finder"
      ? finderSection === "projects"
        ? "Projects"
        : finderSection === "resume"
          ? "Resume"
          : finderSection === "experience"
            ? "Experience"
            : "Skills"
      : app?.kind === "ask"
        ? "Ask"
        : app?.kind === "mail"
          ? "Contact"
          : app?.kind === "systems"
            ? "Systems"
            : app?.kind === "wallpaper"
              ? "Wallpaper"
              : app?.kind === "trash"
                ? "Trash"
                : app?.kind === "about"
                  ? "About"
                  : activeProject?.name ?? "";

  const finderApp = app?.kind === "finder";

  return (
    <>
      <div className="mobile-home relative flex h-[100dvh] flex-col overflow-hidden pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="min-h-0 flex-1">
          <div
            ref={scrollerRef}
            className="mobile-home-pages flex h-full snap-x snap-mandatory overflow-x-auto"
          >
            <section className="mobile-home-page flex h-full w-full shrink-0 basis-full snap-center flex-col px-4">
              <div className="shrink-0 pt-3 text-center">
                <p className="mobile-home-time text-[4.6rem] leading-none font-light tracking-tight text-white tabular-nums drop-shadow-[0_2px_12px_rgb(0_0_0_/_0.35)]">
                  {time}
                </p>
                <p className="mt-2 text-[15px] font-medium tracking-wide text-white/90 drop-shadow-[0_1px_4px_rgb(0_0_0_/_0.45)]">
                  {day}
                </p>
              </div>

              <div className="mt-auto flex flex-col gap-4 pb-2">
                <FeaturedWorkWidget
                  onOpen={(project) => openApp({ kind: "project", id: project.id })}
                />
                <div className="rounded-[1.35rem] border border-white/10 bg-black/45 px-4 py-3 shadow-[0_10px_30px_rgb(0_0_0_/_0.28)] backdrop-blur-md">
                  <h1 className="text-[18px] font-semibold tracking-tight text-white">{site.name}</h1>
                  <p className="text-[13px] text-white/75">{site.role}</p>
                  <p className="mt-0.5 text-[12px] text-white/50">{site.location}</p>
                </div>
                <div className="grid grid-cols-4 gap-x-2 gap-y-5">
                  {page1.map((item) => (
                    <HomeIcon key={item.id} label={item.label} icon={item.icon} onClick={item.onOpen} />
                  ))}
                </div>
              </div>
            </section>

            <section className="mobile-home-page flex h-full w-full shrink-0 basis-full snap-center flex-col px-4">
              <div className="grid grid-cols-4 gap-x-2 gap-y-5 pt-3">
                {page2.map((item) => (
                  <HomeIcon key={item.id} label={item.label} icon={item.icon} onClick={item.onOpen} />
                ))}
              </div>
            </section>
          </div>
        </div>

        <div className="mt-3 shrink-0 px-4">
          <div className="mb-3 flex items-center justify-center gap-1.5" aria-hidden>
            {[0, 1].map((index) => (
              <span
                key={index}
                className={cn(
                  "h-1.5 w-1.5 rounded-full transition",
                  page === index ? "bg-white" : "bg-white/35",
                )}
              />
            ))}
          </div>

          <div className="mobile-home-dock mx-auto flex max-w-sm items-end justify-around gap-2 rounded-[1.75rem] bg-white/16 px-4 py-3 shadow-[0_12px_40px_rgb(0_0_0_/_0.28)] backdrop-blur-xl">
            {dock.map((item) => (
              <HomeIcon key={item.id} label={item.label} icon={item.icon} onClick={item.onOpen} />
            ))}
          </div>
        </div>
      </div>

      {app ? (
        <AppSheet title={sheetTitle} onClose={closeApp} hideTitle={finderApp}>
          {app.kind === "finder" ? (
            <FolderGrid
              className="h-full"
              columns={3}
              variant="app"
              section={finderSection}
              onSectionChange={setFinderSection}
            />
          ) : null}
          {app.kind === "ask" ? <ChatTile className="h-full min-h-0" framed={false} /> : null}
          {app.kind === "mail" ? <ContactForm className="h-full" framed={false} /> : null}
          {app.kind === "systems" ? (
            <SystemsOverviewCarousel className="h-full" framed={false} />
          ) : null}
          {app.kind === "wallpaper" ? <WallpaperSheet onPicked={closeApp} /> : null}
          {app.kind === "trash" ? <TrashSheet /> : null}
          {app.kind === "about" ? <AboutSheet /> : null}
          {app.kind === "project" && activeProject ? (
            <ProjectDetail project={activeProject} onBack={closeApp} className="h-full" />
          ) : null}
        </AppSheet>
      ) : null}
    </>
  );
}
