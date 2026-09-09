"use client";

import { useDesktopMode } from "@/components/desktop/DesktopModeProvider";

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
      <path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5.2v-5.2h-3.6V21H5a1 1 0 0 1-1-1v-9.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClusterIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
      <rect x="3.5" y="4" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="10.5" y="9" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="5.5" y="14" width="8" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function HomeToggle() {
  const { isHome, isSolo, goHome, showCluster } = useDesktopMode();
  const showClusterIcon = isHome || isSolo;

  return (
    <button
      type="button"
      title={showClusterIcon ? "Show all windows" : "Go to Home"}
      aria-label={showClusterIcon ? "Show all windows" : "Go to Home"}
      aria-pressed={isHome}
      onClick={() => (showClusterIcon ? showCluster() : goHome())}
      className={`grid h-6 w-6 place-items-center rounded-md transition hover:bg-white/12 hover:text-white ${
        showClusterIcon ? "bg-white/14 text-white" : "text-white/85"
      }`}
    >
      {showClusterIcon ? <ClusterIcon /> : <HomeIcon />}
    </button>
  );
}
