import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tavonza AI | Customer Hospitality & Dining",
  description: "Discover restaurants around you, order for delivery, pickup, or dine-in, and get personalized Tavonza AI recommendations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} dark h-full antialiased`}
    >
      <body className="min-h-full bg-neutral-950 text-white font-sans flex flex-col selection:bg-yellow-400 selection:text-black">
        {children}
      </body>
    </html>
  );
}

