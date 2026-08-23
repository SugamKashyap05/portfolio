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

const siteUrl = "https://sugamkashyap05.github.io/portfolio/";
const metaTitle = `${site.name} — ${site.role}`;
const metaDescription = `${site.name} — full stack developer and AI systems engineer. A scroll-driven ascent from misty dawn launch to the edge of space.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: metaTitle,
  description: metaDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Sugam Kashyap — Portfolio",
    title: metaTitle,
    description: metaDescription,
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: metaTitle,
    description: metaDescription,
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  email: `mailto:${site.email}`,
  url: siteUrl,
  sameAs: [site.socials[0].href, site.socials[1].href],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Ludhiana",
    addressRegion: "Punjab",
    addressCountry: "IN",
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
