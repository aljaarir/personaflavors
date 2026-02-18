import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "tasteprofile — Discover the person hiding in your taste",
  description:
    "Connect your Letterboxd, Goodreads, Backloggd, and ScoraSong profiles. We synthesize your ratings across every medium into a deep personality archetype and bespoke visual trait map.",
  keywords: ["personality", "taste", "letterboxd", "goodreads", "backloggd", "music", "archetype", "analysis"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}