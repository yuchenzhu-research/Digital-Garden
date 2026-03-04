import { cn } from "@/lib/utils";

interface BentoGridProps {
  className?: string;
  children?: React.ReactNode;
}

export const BentoGrid = ({ className, children }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {children}
    </div>
  );
};

interface BentoGridItemProps {
  className?: string;
  children?: React.ReactNode;
  span?: "full" | "double" | "single";
}

export const BentoGridItem = ({
  className,
  children,
  span = "single",
}: BentoGridItemProps) => {
  const spanClasses = {
    full: "md:col-span-2 lg:col-span-3",
    double: "md:col-span-2 lg:col-span-2",
    single: "col-span-1",
  };

  return (
    <div className={cn(spanClasses[span], className)}>
      {children}
    </div>
  );
};