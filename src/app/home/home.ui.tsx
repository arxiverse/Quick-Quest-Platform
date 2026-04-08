import type { ReactNode } from "react";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Surface({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-[18px] border border-base-300/70 bg-base-100 text-base-content shadow-[0_3px_8px_rgba(17,24,40,0.08)]", className)}>
      {children}
    </div>
  );
}

