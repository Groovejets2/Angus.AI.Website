import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "700"],   // pruned from 5 weights to 2 - saves ~80KB woff2
});

export const metadata: Metadata = {
  title: "Angus AI - AI strategy and implementation for NZ businesses",
  description:
    "Independent AI guidance for New Zealand businesses. We help leaders identify, implement, and optimise AI where it earns its keep - and avoid where it does not.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${plusJakarta.variable} font-sans antialiased bg-black`}>
        {children}
      </body>
    </html>
  );
}
