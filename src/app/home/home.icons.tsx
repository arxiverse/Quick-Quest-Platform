import type { ComponentType } from "react";
import type { HomeIconKey } from "./home";

export type HomeIconProps = {
  className?: string;
};

export function SearchIcon({ className }: HomeIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M20 20L16.2 16.2" strokeLinecap="round" />
    </svg>
  );
}

export function HomeIcon({ className }: HomeIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M4 10.5L12 4L20 10.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 9.5V19H17.5V9.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function AnalysisIcon({ className }: HomeIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M5 19V10" strokeLinecap="round" />
      <path d="M12 19V5" strokeLinecap="round" />
      <path d="M19 19V13" strokeLinecap="round" />
      <path d="M4 19H20" strokeLinecap="round" />
    </svg>
  );
}

export function BriefcaseIcon({ className }: HomeIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <rect x="4" y="7" width="16" height="12" rx="2" />
      <path d="M9 7V5.5C9 4.67 9.67 4 10.5 4H13.5C14.33 4 15 4.67 15 5.5V7" />
      <path d="M4 12H20" />
    </svg>
  );
}

export function HistoryIcon({ className }: HomeIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M4 12A8 8 0 1 0 7 5.8" strokeLinecap="round" />
      <path d="M4 4V9H9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 8V12L15 14" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function LeaderboardIcon({ className }: HomeIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M5 19V11" strokeLinecap="round" />
      <path d="M10 19V7" strokeLinecap="round" />
      <path d="M15 19V13" strokeLinecap="round" />
      <path d="M20 19V9" strokeLinecap="round" />
    </svg>
  );
}

export function SwitchIcon({ className }: HomeIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M7 7H19" strokeLinecap="round" />
      <path d="M14 4L19 7L14 10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 17H5" strokeLinecap="round" />
      <path d="M10 14L5 17L10 20" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function LogoutIcon({ className }: HomeIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M10 5H6.5C5.67 5 5 5.67 5 6.5V17.5C5 18.33 5.67 19 6.5 19H10" strokeLinecap="round" />
      <path d="M14 8L18 12L14 16" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 12H9" strokeLinecap="round" />
    </svg>
  );
}

export function UserIcon({ className }: HomeIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.5 19C6.8 15.87 9.04 14.5 12 14.5C14.96 14.5 17.2 15.87 18.5 19" strokeLinecap="round" />
    </svg>
  );
}

export function ElementIcon({ className }: HomeIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </svg>
  );
}

export function ChatIcon({ className }: HomeIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M6 17.5L4.5 20L4.2 17.3C3.45 16.2 3 14.88 3 13.5C3 9.36 7.03 6 12 6C16.97 6 21 9.36 21 13.5C21 17.64 16.97 21 12 21C10.37 21 8.84 20.64 7.51 20.01" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function FilterIcon({ className }: HomeIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M5 7H19L14 13V18L10 20V13L5 7Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function LiveIcon({ className }: HomeIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none" />
      <path d="M5 12C5 9.24 7.24 7 10 7" strokeLinecap="round" />
      <path d="M19 12C19 9.24 16.76 7 14 7" strokeLinecap="round" />
      <path d="M3 12C3 8.13 6.13 5 10 5" strokeLinecap="round" />
      <path d="M21 12C21 8.13 17.87 5 14 5" strokeLinecap="round" />
    </svg>
  );
}

export function TagIcon({ className }: HomeIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M11 4H6.5L4 6.5V11L12.5 19.5C13.33 20.33 14.67 20.33 15.5 19.5L19.5 15.5C20.33 14.67 20.33 13.33 19.5 12.5L11 4Z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="8" cy="8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ArrowUpIcon({ className }: HomeIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M12 19V5" strokeLinecap="round" />
      <path d="M6.5 10.5L12 5L17.5 10.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DollarIcon({ className }: HomeIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M12 4V20" strokeLinecap="round" />
      <path d="M15.5 7.5C14.83 6.5 13.55 6 12 6C9.79 6 8 7.34 8 9C8 10.66 9.79 12 12 12C14.21 12 16 13.34 16 15C16 16.66 14.21 18 12 18C10.31 18 8.9 17.31 8.2 16.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function StarIcon({ className }: HomeIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 3.75L14.47 8.76L20 9.56L16 13.46L16.94 19L12 16.4L7.06 19L8 13.46L4 9.56L9.53 8.76L12 3.75Z" />
    </svg>
  );
}

export function ChevronDownIcon({ className }: HomeIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M6 9L12 15L18 9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export const homeIconRegistry: Record<HomeIconKey, ComponentType<HomeIconProps>> = {
  home: HomeIcon,
  analysis: AnalysisIcon,
  briefcase: BriefcaseIcon,
  history: HistoryIcon,
  leaderboard: LeaderboardIcon,
  chat: ChatIcon,
  switch: SwitchIcon,
  logout: LogoutIcon,
  user: UserIcon,
  element: ElementIcon,
  search: SearchIcon,
  filter: FilterIcon,
  chevronDown: ChevronDownIcon,
  live: LiveIcon,
  tag: TagIcon,
  arrowUp: ArrowUpIcon,
  dollar: DollarIcon,
  star: StarIcon,
};
