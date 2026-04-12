/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from "react";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Surface({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-[14px] border border-base-300/70 bg-base-100 text-base-content shadow-[0_6px_18px_rgba(15,23,42,0.07)]",
        className
      )}
    >
      {children}
    </div>
  );
}


