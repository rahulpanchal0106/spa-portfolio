"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type WindowAppId = "finder" | "systems" | "ask" | "mail";
export type DesktopAppId = WindowAppId | "wallpaper";
export type FinderSection = "projects" | "resume" | "experience" | "skills";

type DesktopMode = "cluster" | "home" | "solo";

type DesktopModeContextValue = {
  mode: DesktopMode;
  soloApp: WindowAppId | null;
  finderSection: FinderSection;
  setFinderSection: (section: FinderSection) => void;
  goHome: () => void;
  showCluster: () => void;
  openSolo: (app: WindowAppId) => void;
  openFinder: (section?: FinderSection) => void;
  isHome: boolean;
  isSolo: boolean;
  isCluster: boolean;
};

const DesktopModeContext = createContext<DesktopModeContextValue | null>(null);

export function DesktopModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<DesktopMode>("cluster");
  const [soloApp, setSoloApp] = useState<WindowAppId | null>(null);
  const [finderSection, setFinderSection] = useState<FinderSection>("projects");

  const goHome = useCallback(() => {
    setMode("home");
    setSoloApp(null);
  }, []);

  const showCluster = useCallback(() => {
    setSoloApp(null);
    setMode("cluster");
  }, []);

  const openSolo = useCallback((app: WindowAppId) => {
    setSoloApp(app);
    setMode("solo");
  }, []);

  const openFinder = useCallback((section?: FinderSection) => {
    if (section) setFinderSection(section);
    setSoloApp("finder");
    setMode("solo");
  }, []);

  const value = useMemo(
    () => ({
      mode,
      soloApp,
      finderSection,
      setFinderSection,
      goHome,
      showCluster,
      openSolo,
      openFinder,
      isHome: mode === "home",
      isSolo: mode === "solo",
      isCluster: mode === "cluster",
    }),
    [mode, soloApp, finderSection, goHome, showCluster, openSolo, openFinder],
  );

  return <DesktopModeContext.Provider value={value}>{children}</DesktopModeContext.Provider>;
}

export function useDesktopMode() {
  const ctx = useContext(DesktopModeContext);
  if (!ctx) throw new Error("useDesktopMode must be used within DesktopModeProvider");
  return ctx;
}

export function useOptionalDesktopMode() {
  return useContext(DesktopModeContext);
}
