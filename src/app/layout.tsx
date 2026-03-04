import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { CustomCursor } from "@/components/ui/CustomCursor";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bibliotheca Academica",
  description: "A digital renaissance archive.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
          playfair.variable
        )}
      >
        <CustomCursor />
        {/* Layer 0: Warm Beige Background - Alet style */}

        <div className="fixed inset-0 -z-50 bg-background" />

        {/* Layer 1: Subtle texture overlay */}
        <div
          className="fixed inset-0 -z-40 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at center, rgba(61, 52, 40, 0.03) 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
          }}
        />

        {/* Layer 2: Very subtle warm glow - minimal */}
        <div
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-30 h-[100vh] w-[100vw] rounded-full bg-foreground/2 blur-[150px]"
        />

        {/* Main Content */}
        <div className="relative">
          {children}
        </div>

        {/* Noise texture overlay (optional) */}
        <div className="fixed inset-0 -z-10 opacity-[0.008] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("/noise.svg")' }} />
      </body>
    </html>
  );
}