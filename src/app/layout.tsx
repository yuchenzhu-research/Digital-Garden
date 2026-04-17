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
  title: "Bibliotheca Vitae",
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
          "min-h-screen bg-background font-sans antialiased selection:bg-primary/20 selection:text-primary",
          inter.variable,
          playfair.variable
        )}
      >
        <CustomCursor />
        
        {/* Layer 0: Deep Archive Canvas */}
        <div className="fixed inset-0 -z-50 bg-background" />

        {/* Layer 1: Subtle Archival Grit (Grain) */}
        <div 
          className="fixed inset-0 -z-40 opacity-[0.03] pointer-events-none mix-blend-overlay" 
          style={{ backgroundImage: 'url("/noise.svg")' }} 
        />

        {/* Layer 2: Soft Tonal Variation (Museum Spotlight Feel) */}
        <div
          className="fixed inset-0 -z-30 opacity-40 pointer-events-none"
          style={{
            background: `
              radial-gradient(circle at 20% 20%, var(--primary) 0%, transparent 25%),
              radial-gradient(circle at 80% 80%, var(--accent) 0%, transparent 30%),
              radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)
            `,
            filter: 'blur(120px)'
          }}
        />

        {/* Main Content */}
        <div className="relative">
          {children}
        </div>
      </body>
    </html>
  );
}
