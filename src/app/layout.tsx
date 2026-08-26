import type { Metadata } from "next";
import { IBM_Plex_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { AnimeLandscape } from "@/components/background/AnimeLandscape";
import { site } from "@/lib/site";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const plex = IBM_Plex_Mono({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: `${site.name} — ${site.role}`,
  description:
    "Full-stack engineer building production web systems, realtime tools, and applied AI. HireTrack, Selldocs, React BRAI, and a resume chatbot.",
};

export const viewport = {
  themeColor: "#1c1c1e",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${jakarta.variable} ${plex.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        <AnimeLandscape />
        <div className="grain" />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
