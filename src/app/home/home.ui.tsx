/* eslint-disable react-refresh/only-export-components */


export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Surface({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[14px] border border-base-300/70 bg-base-100 text-base-content shadow-[0_6px_18px_rgba(15,23,42,0.07)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}


