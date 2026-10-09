import type { Metadata } from "next";
import "./globals.css";
import { Geist, Space_Grotesk } from "next/font/google";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-hero",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DC Agentic | Understand AI",
  description:
    "Artificial intelligence explained for everyone. Explore AI concepts, practical tutorials, and production-grade AI engineering.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`font-sans ${geist.variable} ${spaceGrotesk.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}