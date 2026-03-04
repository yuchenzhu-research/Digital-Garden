"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  accentColor?: "violet" | "amber" | "cyan" | "rose" | "emerald" | "blue";
  onClick?: () => void;
  href?: string;
}

// Light theme accent color styles
const accentColorStyles = {
  violet: {
    container: "hover:border-violet-300 hover:shadow-violet-200/50",
    glow: "from-violet-200/30 via-transparent to-transparent",
    icon: "text-violet-500",
    iconHover: "group-hover:text-violet-400",
    bg: "bg-violet-100",
  },
  amber: {
    container: "hover:border-amber-300 hover:shadow-amber-200/50",
    glow: "from-amber-200/30 via-transparent to-transparent",
    icon: "text-amber-500",
    iconHover: "group-hover:text-amber-400",
    bg: "bg-amber-100",
  },
  cyan: {
    container: "hover:border-cyan-300 hover:shadow-cyan-200/50",
    glow: "from-cyan-200/30 via-transparent to-transparent",
    icon: "text-cyan-500",
    iconHover: "group-hover:text-cyan-400",
    bg: "bg-cyan-100",
  },
  rose: {
    container: "hover:border-rose-300 hover:shadow-rose-200/50",
    glow: "from-rose-200/30 via-transparent to-transparent",
    icon: "text-rose-500",
    iconHover: "group-hover:text-rose-400",
    bg: "bg-rose-100",
  },
  emerald: {
    container: "hover:border-emerald-300 hover:shadow-emerald-200/50",
    glow: "from-emerald-200/30 via-transparent to-transparent",
    icon: "text-emerald-500",
    iconHover: "group-hover:text-emerald-400",
    bg: "bg-emerald-100",
  },
  blue: {
    container: "hover:border-blue-300 hover:shadow-blue-200/50",
    glow: "from-blue-200/30 via-transparent to-transparent",
    icon: "text-blue-500",
    iconHover: "group-hover:text-blue-400",
    bg: "bg-blue-100",
  },
};

export function BentoCard({
  children,
  className,
  hover = true,
  accentColor,
  onClick,
  href,
}: BentoCardProps) {
  const router = useRouter();
  const accent = accentColor ? accentColorStyles[accentColor] : null;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      router.push(href);
    }
  };

  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, y: -2 } : undefined}
      whileTap={hover ? { scale: 0.98 } : undefined}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onClick={handleClick}
      className={cn(
        // Light theme: white/80 background, light borders
        "rounded-3xl border border-slate-200/60 bg-white/70 backdrop-blur-md p-6",
        "transition-all duration-300 ease-out",
        (onClick || href) && "cursor-pointer select-none",
        hover && accent
          ? accent.container
          : hover && "hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50",
        className
      )}
      role={(onClick || href) ? "button" : undefined}
      tabIndex={(onClick || href) ? 0 : undefined}
      onKeyDown={(e) => {
        if ((onClick || href) && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Gradient Glow overlay on hover */}
      {accent && (
        <div
          className={cn(
            "absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500",
            "bg-gradient-to-br",
            accent.glow,
            "pointer-events-none"
          )}
        />
      )}

      {/* Inner glow on hover */}
      <div
        className={cn(
          "absolute inset-0 -z-10 rounded-3xl opacity-0 transition-opacity duration-500",
          "bg-gradient-to-br from-white/50 to-transparent pointer-events-none"
        )}
      />

      {children}
    </motion.div>
  );
}

// Icon Card variant for category items
interface IconCardProps {
  icon: React.ReactNode;
  title: string;
  count: string;
  accentColor: "violet" | "amber" | "cyan";
  onClick?: () => void;
  description: string;
}

export function IconCard({ icon, title, count, accentColor, onClick, description }: IconCardProps) {
  const accent = accentColorStyles[accentColor];

  return (
    <BentoCard
      accentColor={accentColor}
      onClick={onClick}
      className="h-full"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center", accent.bg)}>
            {icon}
          </div>
          <div>
            <h4 className="font-serif text-lg">{title}</h4>
            <p className="font-sans text-xs text-muted-foreground/50">{count}</p>
          </div>
        </div>
        <ArrowRight className={cn("h-5 w-5 text-muted-foreground/40 transition-all duration-300", accent.iconHover)} />
      </div>
      {/* Hover reveal text */}
      <p className="mt-3 text-xs text-muted-foreground/60 opacity-0 transition-all duration-300 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
        {description} →
      </p>
    </BentoCard>
  );
}