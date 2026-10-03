import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import SiteDialogs from "@/components/site-dialogs";
import "./globals.css";

// .variable classNames go on <html>, not <body> — Tailwind v4's `@theme
// inline` (globals.css) resolves var(--font-inter) etc. at whichever
// element next/font actually sets them on. Both Koto and Kibi put
// these on <body> and reference them from a plain (non-inline) @theme
// block, which resolves at :root — before the variable exists — and
// silently falls through to the fallback font. Keeping it on <html>
// sidesteps that.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kirk Clarke",
  description:
    "Portfolio of Kirk Clarke — designer, engineer, and technology leader.",
};

// Resolves and applies the theme class before first paint, so a
// light-preferring visitor never sees a dark flash (the bug in Koto's
// own toggle, which applies its class inside a useEffect — after
// hydration, after paint). Order: a stored override wins; otherwise
// follow the OS. Errors (private browsing, blocked storage) fail
// closed to the dark default.
const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var light = stored ? stored === "light" : matchMedia("(prefers-color-scheme: light)").matches;
    if (light) document.documentElement.classList.add("light");
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <SiteDialogs>{children}</SiteDialogs>
        <Analytics />
      </body>
    </html>
  );
}
