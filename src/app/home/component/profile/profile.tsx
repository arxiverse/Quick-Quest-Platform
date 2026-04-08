import type { ReactNode } from "react";
import Logo from "../../../../assets/Figma/QQMLogo.png";
import { cn, Surface } from "../../home.ui";
import type { ProfileProps, ProfileQuestItem, ProfileStatItem } from "./profile";
import type { HomeProfile } from "../../home";

const profileStats: ProfileStatItem[] = [
  { label: "Quest Selesai", value: "394", toneClass: "text-[#00D7BE]", iconKey: "quest" },
  { label: "PP", value: "6495", toneClass: "text-[#FF27C8]", iconKey: "pp" },
  { label: "Rank Global", value: "#1", toneClass: "text-[#6B21FF]", iconKey: "rank" },
  { label: "Rank Nasional", value: "#1", toneClass: "text-[#00A63E]", iconKey: "nation" },
  { label: "Akurasi", value: "99.58%", toneClass: "text-[#FF2F2F]", iconKey: "accuracy" },
  { label: "Tingkatan", value: "Q2", toneClass: "text-[#6B21FF]", iconKey: "level" },
];

const profileQuestItems: ProfileQuestItem[] = [
  {
    title: "Bersihkan Toko",
    owner: "Neira",
    role: "Pedagang",
    category: "Bersih - Bersih, Tukang",
    points: "+ 125 pp",
    reward: "Rp. 150.000 - Rp.250.000",
    score: "2.68",
  },
  {
    title: "Membersihkan Kandang Ayam",
    owner: "Neira",
    role: "Pedagang",
    category: "Bersih - Bersih, Cleaning Service",
    points: "+ 245 pp",
    reward: "Rp. 200.000 - Rp.350.000",
    score: "2.97",
  },
];

function IdentityIcon({ children }: { children: ReactNode }) {
  return <span className="mt-0.5 inline-flex size-5 items-center justify-center text-base-content">{children}</span>;
}

function UserIdentityIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="size-[18px]">
      <circle cx="12" cy="7.5" r="3.2" />
      <path d="M6 18.5C7.08 15.97 9.03 14.8 12 14.8C14.97 14.8 16.92 15.97 18 18.5" strokeLinecap="round" />
    </svg>
  );
}

function MailIdentityIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="size-[18px]">
      <rect x="4" y="6" width="16" height="12" rx="2" />
      <path d="M5 8L12 13L19 8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PhoneIdentityIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="size-[18px]">
      <path d="M7 4.5H10L11.4 8.1L9.8 9.7C10.61 11.33 11.67 12.39 13.3 13.2L14.9 11.6L18.5 13V16C18.5 17.1 17.6 18 16.5 18H16C10.75 18 6.5 13.75 6.5 8.5V8C6.5 6.9 5.6 4.5 7 4.5Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LocationIdentityIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="size-[18px]">
      <path d="M12 20C15.5 15.6 17.25 12.52 17.25 9.75C17.25 6.57 14.68 4 11.5 4C8.32 4 5.75 6.57 5.75 9.75C5.75 12.52 7.5 15.6 11 20" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="11.5" cy="9.5" r="1.8" />
    </svg>
  );
}

function StatIcon({ iconKey, className = "" }: { iconKey: ProfileStatItem["iconKey"]; className?: string }) {
  if (iconKey === "quest") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={cn("size-5", className)}>
        <rect x="5" y="4" width="14" height="16" rx="2" />
        <path d="M9 4.5H15" strokeLinecap="round" />
        <path d="M8 11H16" strokeLinecap="round" />
        <path d="M8 15H13" strokeLinecap="round" />
      </svg>
    );
  }

  if (iconKey === "pp") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={cn("size-5", className)}>
        <path d="M12 5V19" strokeLinecap="round" />
        <path d="M6.5 10.5L12 5L17.5 10.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 18L12 14L16 18" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (iconKey === "rank") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={cn("size-5", className)}>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 7.5V16.5" strokeLinecap="round" />
        <path d="M7.5 12H16.5" strokeLinecap="round" />
        <path d="M8.8 8.8L15.2 15.2" strokeLinecap="round" />
      </svg>
    );
  }

  if (iconKey === "nation") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={cn("size-5", className)}>
        <circle cx="12" cy="12" r="8" />
        <path d="M4 12H20" strokeLinecap="round" />
        <path d="M12 4C14.35 6.1 15.67 8.75 15.67 12C15.67 15.25 14.35 17.9 12 20" strokeLinecap="round" />
        <path d="M12 4C9.65 6.1 8.33 8.75 8.33 12C8.33 15.25 9.65 17.9 12 20" strokeLinecap="round" />
      </svg>
    );
  }

  if (iconKey === "accuracy") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" className={cn("size-5", className)}>
        <path d="M13 3L6.5 13H11L10 21L17.5 10.5H13.2L13 3Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={cn("size-5", className)}>
      <path d="M9 16.5H15" strokeLinecap="round" />
      <path d="M8 8.5H16" strokeLinecap="round" />
      <path d="M8 12.5H16" strokeLinecap="round" />
      <rect x="5" y="4.5" width="14" height="15" rx="3" />
    </svg>
  );
}

function MetricPill({ icon, children, className = "" }: { icon: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex size-5 items-center justify-center">{icon}</div>
      <span className={cn("inline-flex rounded-[10px] px-3 py-1 text-xs font-bold text-black", className)}>{children}</span>
    </div>
  );
}

function QuestCard({ quest }: { quest: ProfileQuestItem }) {
  return (
    <div className="rounded-[18px] border border-base-300/70 bg-base-100 p-4 shadow-[0_3px_10px_rgba(17,24,40,0.08)] sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-base-content sm:text-[2rem]">{quest.title}</h3>
        </div>
        <div className="flex items-start gap-3">
          <div className="text-right">
            <p className="text-lg font-bold text-base-content sm:text-[2rem]">{quest.owner}</p>
            <p className="text-sm font-medium text-base-content/55 sm:text-xl">{quest.role}</p>
          </div>
          <div className="size-12 rounded-[12px] bg-base-300 sm:size-[64px]" />
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:mt-5">
        <div className="flex items-center gap-2.5 text-sm font-semibold text-base-content/80 sm:text-lg">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="size-5 text-[#FF27C8] sm:size-6">
            <path d="M11 4H6.5L4 6.5V11L12.5 19.5C13.33 20.33 14.67 20.33 15.5 19.5L19.5 15.5C20.33 14.67 20.33 13.33 19.5 12.5L11 4Z" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="8" cy="8" r="1.1" fill="currentColor" stroke="none" />
          </svg>
          <span>{quest.category}</span>
        </div>

        <MetricPill icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="size-5 text-[#6B21FF]"><path d="M12 19V5" strokeLinecap="round" /><path d="M6.5 10.5L12 5L17.5 10.5" strokeLinecap="round" strokeLinejoin="round" /></svg>} className="bg-[#33D8FF]">
          {quest.points}
        </MetricPill>

        <MetricPill icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="size-5 text-[#00A7D7]"><path d="M12 4V20" strokeLinecap="round" /><path d="M15.5 7.5C14.83 6.5 13.55 6 12 6C9.79 6 8 7.34 8 9C8 10.66 9.79 12 12 12C14.21 12 16 13.34 16 15C16 16.66 14.21 18 12 18C10.31 18 8.9 17.31 8.2 16.2" strokeLinecap="round" strokeLinejoin="round" /></svg>} className="bg-[#88FF21]">
          {quest.reward}
        </MetricPill>

        <MetricPill icon={<svg viewBox="0 0 24 24" fill="currentColor" className="size-5 text-[#FF8A00]"><path d="M12 3.75L14.47 8.76L20 9.56L16 13.46L16.94 19L12 16.4L7.06 19L8 13.46L4 9.56L9.53 8.76L12 3.75Z" /></svg>} className="bg-[#CAFFD0]">
          {quest.score}
        </MetricPill>
      </div>

      <div className="mt-6 flex justify-end">
        <button type="button" className="btn h-11 min-h-11 rounded-[10px] border-none bg-primary px-7 text-sm text-primary-content shadow-none hover:opacity-90 sm:h-12 sm:min-h-12 sm:px-10 sm:text-base">
          Detail
        </button>
      </div>
    </div>
  );
}

function ProfileIdentityRow({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 text-sm text-base-content sm:text-base">
      <IdentityIcon>{icon}</IdentityIcon>
      <span className="leading-relaxed">{children}</span>
    </div>
  );
}

export function ProfileContent({ profile }: { profile: HomeProfile }) {
  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <Surface className="p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:gap-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex size-[72px] shrink-0 items-center justify-center rounded-[14px] bg-base-200 sm:size-[92px]">
                <img src={Logo} alt="QQM" className="size-[52px] object-contain sm:size-[68px]" />
              </div>
              <div className="min-w-0 space-y-2">
                <ProfileIdentityRow icon={<UserIdentityIcon />}>{profile.name}</ProfileIdentityRow>
                <ProfileIdentityRow icon={<MailIdentityIcon />}>{profile.email}</ProfileIdentityRow>
                <ProfileIdentityRow icon={<PhoneIdentityIcon />}>{profile.phone}</ProfileIdentityRow>
                <ProfileIdentityRow icon={<LocationIdentityIcon />}>{profile.address}</ProfileIdentityRow>
              </div>
            </div>
            <button type="button" className="btn h-10 min-h-10 rounded-[12px] border-none bg-primary px-5 text-sm text-primary-content shadow-none hover:opacity-90 sm:h-12 sm:min-h-12 sm:px-7 sm:text-base">
              Ubah
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {profileStats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-2.5 rounded-[14px] border border-base-300/60 bg-base-100 px-3 py-2.5">
                <StatIcon iconKey={stat.iconKey} className={stat.toneClass} />
                <p className="text-sm font-semibold text-base-content sm:text-base">
                  <span>{stat.label}</span>
                  <span className="mx-1">:</span>
                  <span>{stat.value}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </Surface>

      <Surface className="p-4 sm:p-5">
        <div className="mb-4 flex items-center gap-3 sm:mb-5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5 text-[#6B21FF] sm:size-6">
            <rect x="5" y="4" width="14" height="16" rx="2" />
            <path d="M9 4.5H15" strokeLinecap="round" />
            <path d="M8 11H16" strokeLinecap="round" />
            <path d="M8 15H13" strokeLinecap="round" />
          </svg>
          <h2 className="text-xl font-bold text-base-content sm:text-[2rem]">Quest Giver</h2>
        </div>

        <div className="space-y-4">
          {profileQuestItems.map((quest) => (
            <QuestCard key={`${quest.title}-${quest.score}`} quest={quest} />
          ))}
        </div>

        <div className="mt-5 flex items-center justify-end gap-3 xl:hidden">
          <button type="button" className="btn h-11 min-h-11 rounded-[10px] border-base-300 bg-base-200 px-5 text-sm text-base-content shadow-none hover:bg-base-200">
            Lihat Semua
          </button>
          <button type="button" className="btn h-11 min-h-11 rounded-[10px] border-none bg-primary px-5 text-sm text-primary-content shadow-none hover:opacity-90">
            Riwayat
          </button>
        </div>
      </Surface>
    </div>
  );
}

function ProfileComponent({ profile, compact = false, className = "", showMeta = true }: ProfileProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-[18px] border border-base-300/70 bg-base-100/95 shadow-[0_3px_10px_rgba(17,24,40,0.08)] backdrop-blur",
        compact ? "px-3 py-2" : "px-3 py-2.5 sm:px-4 sm:py-3",
        className
      )}
    >
      <div className="relative shrink-0">
        <div className={cn("avatar", compact && "block")}>
          <div className={cn("rounded-full border border-base-300/70 bg-base-300 shadow-sm", compact ? "size-10" : "size-11 sm:size-[52px]")}>
            <img src={Logo} alt="QQM" className="object-cover p-1.5" />
          </div>
        </div>
        <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-base-100 bg-success" />
      </div>

      <div className="min-w-0 flex-1">
        <p className={cn("truncate font-bold text-base-content", compact ? "text-sm" : "text-sm sm:text-base")}>{profile.name}</p>
        {showMeta && (
          <p className={cn("truncate font-medium text-base-content/60", compact ? "text-[11px]" : "text-xs sm:text-sm")}>
            {profile.role} • {profile.location}
          </p>
        )}
      </div>
    </div>
  );
}

export default ProfileComponent;
