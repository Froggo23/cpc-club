import type { Metadata } from "next";
import { Archivo_Black, Instrument_Serif, Silkscreen, Space_Mono } from "next/font/google";
import Nav from "@/components/Nav";
import "./globals.css";

const display = Archivo_Black({ variable: "--font-display", subsets: ["latin"], weight: "400" });
const serif = Instrument_Serif({ variable: "--font-serif", subsets: ["latin"], weight: "400", style: ["normal", "italic"] });
const pixel = Silkscreen({ variable: "--font-pixel", subsets: ["latin"], weight: ["400", "700"] });
const mono = Space_Mono({ variable: "--font-mono", subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "Competitive Programming Club",
  description: "Projects built by the students of the Competitive Programming Club.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${serif.variable} ${pixel.variable} ${mono.variable}`}>
      <body>
        <Nav />
        {children}
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
