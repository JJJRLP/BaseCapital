import type { Metadata } from "next";
import { Inter, Pinyon_Script } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const pinyon = Pinyon_Script({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pinyon",
});
const winnerSans = localFont({
  src: "../assets/fonts/winner sans.ttf",
  variable: "--font-winner",
});

export const metadata: Metadata = {
  title: "BaseCapital | Institutional Crypto Prop Firm",
  description: "Capital for the 1% of traders. Prove your edge.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${pinyon.variable} ${winnerSans.variable} font-sans bg-[#050505] text-gray-200 antialiased selection:bg-white/20`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
