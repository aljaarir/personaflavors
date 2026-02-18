import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PersonaFlavor — Your taste, decoded",
  description:
    "Connect Letterboxd, GoodReads, Backloggd, and ScoraSong to generate a personality assessment and emotional radar chart.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/*
        suppressHydrationWarning on <body> tells React to ignore
        attribute mismatches on this element only (one level deep).
        This is the correct fix for browser extensions that inject
        styles like `style="isolation: isolate"` onto <body> before
        React hydrates — causing a server/client mismatch.
      */}
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}