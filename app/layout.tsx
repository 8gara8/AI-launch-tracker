import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Ship Speed — 2026",
  description:
    "Live competitive intelligence dashboard tracking AI product launches across Anthropic, OpenAI, Google, and xAI. Updated weekly.",
  openGraph: {
    title: "AI Ship Speed — 2026",
    description:
      "Live competitive intelligence dashboard tracking AI product launches across Anthropic, OpenAI, Google, and xAI. Updated weekly.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${mono.variable} ${display.variable}`}>
      <body className="font-mono bg-bg text-ink min-h-screen">{children}</body>
    </html>
  );
}
