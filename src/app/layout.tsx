import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Stallpoint: find the step that costs you revenue",
    template: "%s · Stallpoint",
  },
  description:
    "Open-source product analytics. Stallpoint turns raw product events into funnels, so you see the exact step where users stall.",
};

export const viewport: Viewport = {
  themeColor: "#0c0d0b",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-dvh bg-ink text-paper">{children}</body>
    </html>
  );
}
