import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Manrope } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/constants";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
  display: "swap",
});

const sans = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${site.name} — ${site.role}`,
  description:
    "Portfolio of Ryo Tanaka as a single scroll-driven ascent — from a misty dawn launch site through cloud decks and the curved-Earth stratosphere to the edge of space.",
};

export const viewport: Viewport = {
  themeColor: "#070d1b",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${mono.variable} ${sans.variable}`} suppressHydrationWarning>
      <body className="bg-void font-body text-signal-ink antialiased">
        {children}
      </body>
    </html>
  );
}
