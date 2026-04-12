import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import Logo from "../../../../assets/Figma/QQMLogo.png";
import { cn, Surface } from "../../home.ui";
import {
  clearProfileSession,
  loadHomeProfile,
  type ProfileProps,
  type ProfileSkillBreakdownItem,
  type ProfileStatItem,
} from "./profile";
import type { HomeProfile } from "../../home";
import { EditProfile } from "./page/edit-profile";
import { KycSettlement } from "./page/kyc-settlement";

type ProfileSubView = 
  | { view: "EditProfile" }
  | { view: "KycSettlement" };

const PROFILE_SUBVIEW_STORAGE_KEY = "nvrs-qqm-profile-subview-v1";

function resolveInitialSubView(): ProfileSubView | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PROFILE_SUBVIEW_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ProfileSubView;
  } catch {
    return null;
  }
}

type VerificationLayer = {
  kycStatus: "Verified";
  verifiedBadge: string;
  trustTier: "Tier A";
  riskBand: "Low Risk";
  lastReview: string;
};

type PpIntelligenceItem = {
  skill: string;
  rating: number;
  difficulty: number;
  valueFactor: number;
  decay: number;
  result: number;
  growth: string;
};

type GrowthPathItem = {
  skill: string;
  currentLevel: "Q1" | "Q2" | "Q3";
  progressToNext: number;
  requirement: string;
  nextLevel: string;
  note: string;
};

type PortfolioContractItem = {
  id: string;
  title: string;
  mode: "Per-Individu" | "Ber-Kelompok";
  role: string;
  valueDelivered: string;
  repeatGiverRate: string;
  impact: string;
  status: "Completed" | "In Progress" | "Pending Confirmation";
};

type ReliabilityTrendItem = {
  metric: string;
  d7: number;
  d30: number;
  target: number;
  unit: "%" | "m";
  preferred: "high" | "low";
};

type EconomicImpactItem = {
  label: string;
  value: string;
  hint: string;
  tone: string;
};

type SettingTabKey = "Umum" | "Notifikasi" | "Personalisasi" | "Kontrol Data" | "Security";

type SettingItem = {
  id: string;
  label: string;
  description: string;
  defaultEnabled: boolean;
  critical?: boolean;
};

const profileStats: ProfileStatItem[] = [
  { label: "Quest Selesai", value: "394", toneClass: "text-[#00D7BE]", iconKey: "quest" },
  { label: "Total PP", value: "6,495", toneClass: "text-[#FF27C8]", iconKey: "pp" },
  { label: "Rank Lokal", value: "#1", toneClass: "text-[#6B21FF]", iconKey: "rank" },
  { label: "Rank Nasional", value: "#3", toneClass: "text-[#00A63E]", iconKey: "nation" },
  { label: "Akurasi", value: "99.58%", toneClass: "text-[#FF2F2F]", iconKey: "accuracy" },
  { label: "Tier Aktif", value: "Q2", toneClass: "text-[#6B21FF]", iconKey: "level" },
];

const verificationLayer: VerificationLayer = {
  kycStatus: "Verified",
  verifiedBadge: "QQM Verified Identity",
  trustTier: "Tier A",
  riskBand: "Low Risk",
  lastReview: "12 Apr 2026",
};

const profileSkillBreakdown: ProfileSkillBreakdownItem[] = [
  { skill: "Cleaning Service", pp: "2,140 PP", share: 36, trend: "+4.2%", toneClass: "bg-[#3B82F6]" },
  { skill: "Retail Helper", pp: "1,860 PP", share: 31, trend: "+2.1%", toneClass: "bg-[#10B981]" },
  { skill: "Delivery Support", pp: "1,240 PP", share: 21, trend: "-0.8%", toneClass: "bg-[#F59E0B]" },
  { skill: "Tech Assist", pp: "755 PP", share: 12, trend: "+5.0%", toneClass: "bg-[#A855F7]" },
];

const profileBadges = [
  { id: "b1", label: "Night Owl", type: "gold", icon: "🦉", desc: "Selesai 50 quest malam" },
  { id: "b2", label: "Elite Runner", type: "mythic", icon: "⚡", desc: "Top 5% Regional" },
  { id: "b3", label: "Fast Responder", type: "silver", icon: "🚀", desc: "Respon < 5 menit" },
  { id: "b4", label: "Trusted Pro", type: "bronze", icon: "🤝", desc: "Rating 4.9+" },
];

const ppIntelligenceRows: PpIntelligenceItem[] = [
  { skill: "Cleaning Service", rating: 4.9, difficulty: 1.25, valueFactor: 1.2, decay: 0.95, result: 6.98, growth: "+8.6%" },
  { skill: "Retail Helper", rating: 4.8, difficulty: 1.1, valueFactor: 1.15, decay: 0.94, result: 5.72, growth: "+6.4%" },
  { skill: "Delivery Support", rating: 4.7, difficulty: 1.18, valueFactor: 1.05, decay: 0.92, result: 5.36, growth: "+4.9%" },
  { skill: "Tech Assist", rating: 4.8, difficulty: 1.32, valueFactor: 1.28, decay: 0.87, result: 6.98, growth: "+9.2%" },
];

const growthPathItems: GrowthPathItem[] = [
  {
    skill: "Cleaning Service",
    currentLevel: "Q2",
    progressToNext: 72,
    requirement: "Butuh 320 PP + completion > 96% untuk Q3.",
    nextLevel: "Q3",
    note: "Fokus quest high-value dengan bukti hasil lengkap.",
  },
  {
    skill: "Retail Helper",
    currentLevel: "Q2",
    progressToNext: 63,
    requirement: "Butuh 410 PP + repeat giver rate >= 35%.",
    nextLevel: "Q3",
    note: "Pertahankan rating di atas 4.8 selama 30 hari.",
  },
  {
    skill: "Delivery Support",
    currentLevel: "Q3",
    progressToNext: 100,
    requirement: "Level puncak tercapai, pertahankan dispute < 1.5%.",
    nextLevel: "Maintain Q3",
    note: "Stabilkan SLA malam dan minimalkan cancel.",
  },
  {
    skill: "Tech Assist",
    currentLevel: "Q1",
    progressToNext: 54,
    requirement: "Butuh 280 PP + 12 quest sukses untuk Q2.",
    nextLevel: "Q2",
    note: "Ambil quest troubleshooting jam 18.00 - 21.00.",
  },
];

const portfolioContracts: PortfolioContractItem[] = [
  {
    id: "CTR-2026-0412-901",
    title: "Restock Minimarket Harian",
    mode: "Per-Individu",
    role: "Runner",
    valueDelivered: "Rp250.000",
    repeatGiverRate: "42%",
    impact: "Stok UMKM stabil sebelum jam sibuk.",
    status: "In Progress",
  },
  {
    id: "CTR-2026-0411-882",
    title: "Survey Display Snack UMKM",
    mode: "Per-Individu",
    role: "Runner",
    valueDelivered: "Rp285.000",
    repeatGiverRate: "38%",
    impact: "Penjualan display naik 14% (dummy insight).",
    status: "Pending Confirmation",
  },
  {
    id: "CTR-2026-0410-744",
    title: "Bersihkan Booth Event",
    mode: "Ber-Kelompok",
    role: "Lead Runner",
    valueDelivered: "Rp380.000",
    repeatGiverRate: "51%",
    impact: "SLA selesai 32 menit lebih cepat dari target.",
    status: "Completed",
  },
  {
    id: "CTR-2026-0409-612",
    title: "Pickup Dokumen Kantor",
    mode: "Per-Individu",
    role: "Runner",
    valueDelivered: "Rp180.000",
    repeatGiverRate: "47%",
    impact: "Dokumen tiba sesuai SLA tanpa dispute.",
    status: "Completed",
  },
];

const reliabilityTrends: ReliabilityTrendItem[] = [
  { metric: "On-time Rate", d7: 96.8, d30: 95.9, target: 95, unit: "%", preferred: "high" },
  { metric: "Cancel Rate", d7: 1.2, d30: 1.6, target: 2, unit: "%", preferred: "low" },
  { metric: "Dispute Ratio", d7: 0.8, d30: 1.1, target: 1.5, unit: "%", preferred: "low" },
  { metric: "First Response", d7: 4.2, d30: 5.1, target: 5, unit: "m", preferred: "low" },
];

const economicImpactItems: EconomicImpactItem[] = [
  { label: "Total Upah Diterima", value: "Rp18.6jt", hint: "30 hari terakhir (runner side)", tone: "bg-[#DBEAFE]" },
  { label: "Total Upah Dibayar", value: "Rp3.2jt", hint: "sebagai giver untuk 14 quest", tone: "bg-[#DCFCE7]" },
  { label: "Kontribusi Fee Platform", value: "Rp1.1jt", hint: "mendukung escrow + trust engine", tone: "bg-[#FEF3C7]" },
  { label: "Quest Komunitas Selesai", value: "342", hint: "impact sosial di ekosistem QQM", tone: "bg-[#E9D5FF]" },
];

const profileSettings: Record<SettingTabKey, SettingItem[]> = {
  Umum: [
    { id: "general-public-profile", label: "Profil publik terlihat", description: "Tampilkan badge, rank, dan skill utama.", defaultEnabled: true },
    { id: "general-show-location", label: "Tampilkan wilayah", description: "Bagikan area umum tanpa alamat detail.", defaultEnabled: true },
    { id: "general-career-headline", label: "Headline karier", description: "Aktifkan headline kontribusi QQM pada profil.", defaultEnabled: true },
  ],
  Notifikasi: [
    { id: "notif-match", label: "Notif match quest", description: "Terima notifikasi saat quest cocok dengan skill aktif.", defaultEnabled: true },
    { id: "notif-escrow", label: "Notif escrow state", description: "Update UNPAID, LOCKED, IN_PROGRESS, RELEASED.", defaultEnabled: true },
    { id: "notif-promo", label: "Notif insight/promo", description: "Saran upah/radius dan campaign mingguan.", defaultEnabled: false },
  ],
  Personalisasi: [
    { id: "personal-dark-mode", label: "Mode tampilan adaptif", description: "Sesuaikan tema berdasarkan preferensi perangkat.", defaultEnabled: true },
    { id: "personal-language", label: "Bahasa Indonesia prioritas", description: "Gunakan copy UX utama dalam Bahasa Indonesia.", defaultEnabled: true },
    { id: "personal-dashboard-focus", label: "Fokus skill feed", description: "Prioritaskan feed berdasarkan lane skill favorit.", defaultEnabled: true },
  ],
  "Kontrol Data": [
    { id: "data-export", label: "Izinkan export data", description: "Download riwayat quest, PP ledger, dan transaksi escrow.", defaultEnabled: true },
    { id: "data-share-analytics", label: "Share data analytics", description: "Bantu optimasi matching QQM secara anonim.", defaultEnabled: true },
    { id: "data-retention", label: "Retensi data minimum", description: "Simpan data sensitif hanya sesuai SLA platform.", defaultEnabled: false },
  ],
  Security: [
    { id: "security-2fa", label: "2FA akun", description: "Gunakan OTP saat login perangkat baru.", defaultEnabled: true, critical: true },
    { id: "security-session-alert", label: "Alert sesi baru", description: "Kirim notifikasi jika ada login tidak dikenal.", defaultEnabled: true, critical: true },
    { id: "security-payout-lock", label: "Payout lock protection", description: "Butuh konfirmasi tambahan saat ubah akun payout.", defaultEnabled: true, critical: true },
  ],
};

const initialSettingState = Object.fromEntries(
  Object.values(profileSettings)
    .flat()
    .map((item) => [item.id, item.defaultEnabled])
) as Record<string, boolean>;

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

function ProfileIdentityRow({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 text-sm text-base-content sm:text-base">
      <IdentityIcon>{icon}</IdentityIcon>
      <span className="leading-relaxed">{children}</span>
    </div>
  );
}

function levelClass(level: GrowthPathItem["currentLevel"]) {
  if (level === "Q1") return "bg-[#DBEAFE] text-[#1D4ED8]";
  if (level === "Q2") return "bg-[#FEF3C7] text-[#92400E]";
  return "bg-[#DCFCE7] text-[#166534]";
}

function contractStatusClass(status: PortfolioContractItem["status"]) {
  if (status === "Completed") return "bg-[#DCFCE7] text-[#166534]";
  if (status === "In Progress") return "bg-[#DBEAFE] text-[#1D4ED8]";
  return "bg-[#FEF3C7] text-[#92400E]";
}

function reliabilityTrendClass(isGood: boolean) {
  return isGood ? "bg-[#DCFCE7] text-[#166534]" : "bg-[#FECACA] text-[#991B1B]";
}

function formatReliabilityValue(value: number, unit: ReliabilityTrendItem["unit"]) {
  return unit === "%" ? `${value.toFixed(1)}%` : `${value.toFixed(1)}m`;
}

export function ProfileContent({ profile }: { profile: HomeProfile }) {
  const navigate = useNavigate();
  const [resolvedProfile, setResolvedProfile] = useState<HomeProfile>(profile);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [activeSettingTab, setActiveSettingTab] = useState<SettingTabKey>("Umum");
  const [settingState, setSettingState] = useState<Record<string, boolean>>(initialSettingState);
  const [subView, setSubView] = useState<ProfileSubView | null>(resolveInitialSubView);

  useEffect(() => {
    let isCancelled = false;

    async function loadProfile() {
      const result = await loadHomeProfile(profile);
      if (isCancelled) return;

      if (result.shouldRedirectToLogin) {
        navigate("/login", { replace: true });
        return;
      }

      setResolvedProfile(result.profile);
      setProfileError(result.errorMessage ?? null);
    }

    loadProfile();
    return () => {
      isCancelled = true;
    };
  }, [navigate, profile]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (subView) {
      window.localStorage.setItem(PROFILE_SUBVIEW_STORAGE_KEY, JSON.stringify(subView));
    } else {
      window.localStorage.removeItem(PROFILE_SUBVIEW_STORAGE_KEY);
    }
  }, [subView]);

  const maxPpResult = useMemo(() => Math.max(...ppIntelligenceRows.map((row) => row.result), 1), []);
  const activeSettings = profileSettings[activeSettingTab];
  const activeEnabledCount = activeSettings.filter((item) => settingState[item.id]).length;
  const settingCompletion = Math.round((activeEnabledCount / activeSettings.length) * 100);

  function toggleSetting(itemId: string) {
    setSettingState((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  }

  if (subView?.view === "EditProfile") {
    return <EditProfile onBack={() => setSubView(null)} />;
  }
  
  if (subView?.view === "KycSettlement") {
    return <KycSettlement onBack={() => setSubView(null)} />;
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <Surface className="p-4 sm:p-6">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex size-[72px] shrink-0 items-center justify-center rounded-[12px] bg-base-200 sm:size-[86px]">
                <img src={Logo} alt="QQM" className="size-[52px] object-contain sm:size-[68px]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-base-content/45">Identity</p>
                <h2 className="mt-1 text-2xl font-bold text-base-content sm:text-[2rem]">{resolvedProfile.name}</h2>
                <p className="mt-1 text-sm text-base-content/60">{resolvedProfile.role}</p>
                <div className="mt-3 space-y-2">
                  <ProfileIdentityRow icon={<UserIdentityIcon />}>{resolvedProfile.name}</ProfileIdentityRow>
                  <ProfileIdentityRow icon={<MailIdentityIcon />}>{resolvedProfile.email}</ProfileIdentityRow>
                  <ProfileIdentityRow icon={<PhoneIdentityIcon />}>{resolvedProfile.phone}</ProfileIdentityRow>
                  <ProfileIdentityRow icon={<LocationIdentityIcon />}>{resolvedProfile.address}</ProfileIdentityRow>
                </div>
              </div>
            </div>
            <div className="flex shrink-0 flex-col gap-2 lg:min-w-[11rem]">
              <button type="button" onClick={() => setSubView({ view: "EditProfile" })} className="btn h-10 min-h-10 rounded-[8px] border-none bg-primary px-5 text-sm text-primary-content shadow-none hover:opacity-90 sm:h-11 sm:min-h-11 sm:px-6">
                Ubah
              </button>
              <Link
                to="/login"
                onClick={() => clearProfileSession()}
                className="btn h-10 min-h-10 rounded-[8px] border-none bg-error px-5 text-sm text-error-content shadow-none hover:opacity-90 sm:h-11 sm:min-h-11 sm:px-6"
              >
                Logout
              </Link>
            </div>
          </div>

          <div className="rounded-[12px] border border-base-300/70 bg-base-100 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-base-content/50">Verification Layer</p>
            <h3 className="mt-1 text-lg font-bold text-base-content">KYC, Verified Badge, dan Trust Tier</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-[999px] bg-[#DCFCE7] px-2.5 py-1 text-[11px] font-bold text-[#166534]">{verificationLayer.kycStatus}</span>
              <span className="rounded-[999px] bg-[#DBEAFE] px-2.5 py-1 text-[11px] font-bold text-[#1D4ED8]">{verificationLayer.verifiedBadge}</span>
              <span className="rounded-[999px] bg-[#E9D5FF] px-2.5 py-1 text-[11px] font-bold text-[#6D28D9]">{verificationLayer.trustTier}</span>
              <span className="rounded-[999px] bg-[#FEF3C7] px-2.5 py-1 text-[11px] font-bold text-[#92400E]">{verificationLayer.riskBand}</span>
            </div>
            <p className="mt-2 text-xs text-base-content/65">Review terakhir: {verificationLayer.lastReview}</p>
          </div>

          <div className="rounded-[12px] border border-base-300/70 bg-base-100 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-base-content/50">Trophy & Badges</p>
            <h3 className="mt-1 text-lg font-bold text-base-content">Pencapaian Rank & Etos Kerja</h3>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {profileBadges.map((badge) => (
                <div key={badge.id} className="group relative flex flex-col items-center gap-2 rounded-[10px] border border-base-300/50 bg-base-200/50 p-3 text-center transition-all hover:bg-base-200">
                  <div className={cn("flex size-10 items-center justify-center rounded-full text-lg shadow-sm border", badge.type === "mythic" ? "bg-gradient-to-tr from-[#A046FF] to-[#38BDF8] text-white border-transparent" : badge.type === "gold" ? "bg-gradient-to-tr from-[#F59E0B] to-[#FBBF24] text-white border-transparent" : badge.type === "silver" ? "bg-gradient-to-tr from-[#94A3B8] to-[#CBD5E1] text-white border-transparent" : "bg-[#B45309] text-white border-transparent")}>
                    {badge.icon}
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-base-content">{badge.label}</p>
                    <p className="mt-0.5 text-[9px] text-base-content/65">{badge.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {profileError ? (
            <div className="rounded-[8px] border border-error/40 bg-error/10 px-3 py-2 text-xs text-error">
              {profileError}
            </div>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {profileStats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-2.5 rounded-[10px] border border-base-300/60 bg-base-100 px-3 py-2.5">
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
      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Surface className="p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-base-content/50">PP Intelligence</p>
          <h3 className="mt-1 text-lg font-bold text-base-content">Formula Breakdown: rating x difficulty x value x decay</h3>
          <p className="mt-1 text-xs text-base-content/65">Formula konsep: `(Rating x Difficulty x Value) x TimeDecay`</p>
          <div className="mt-3 space-y-2.5">
            {ppIntelligenceRows.map((row) => (
              <div key={row.skill} className="rounded-[10px] border border-base-300/60 bg-base-100 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-base-content">{row.skill}</p>
                  <span className="rounded-[8px] bg-[#DBEAFE] px-2 py-0.5 text-[11px] font-semibold text-[#1D4ED8]">{row.growth}</span>
                </div>
                <p className="mt-1 text-xs text-base-content/65">
                  {row.rating.toFixed(1)} x {row.difficulty.toFixed(2)} x {row.valueFactor.toFixed(2)} x {row.decay.toFixed(2)}
                </p>
                <div className="mt-2 h-2 rounded-full bg-base-200">
                  <div className="h-2 rounded-full bg-[#6B21FF]" style={{ width: `${Math.round((row.result / maxPpResult) * 100)}%` }} />
                </div>
                <p className="mt-1 text-[11px] font-semibold text-base-content/70">PP Result Score: {row.result.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </Surface>

        <Surface className="p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-base-content/50">Growth Path Q1-Q3</p>
          <h3 className="mt-1 text-lg font-bold text-base-content">Progress Requirement ke Level Berikutnya per Skill</h3>
          <div className="mt-3 space-y-2.5">
            {growthPathItems.map((item) => (
              <div key={item.skill} className="rounded-[10px] border border-base-300/60 bg-base-100 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-base-content">{item.skill}</p>
                  <span className={cn("rounded-[8px] px-2 py-0.5 text-[11px] font-semibold", levelClass(item.currentLevel))}>{item.currentLevel}</span>
                </div>
                <p className="mt-1 text-xs text-base-content/65">Target: {item.nextLevel}</p>
                <div className="mt-2 h-2 rounded-full bg-base-200">
                  <div className="h-2 rounded-full bg-[#2563EB]" style={{ width: `${item.progressToNext}%` }} />
                </div>
                <p className="mt-1 text-[11px] font-semibold text-base-content/70">{item.progressToNext}% menuju {item.nextLevel}</p>
                <p className="mt-1 text-xs text-base-content/65">{item.requirement}</p>
                <p className="mt-1 text-xs text-base-content/55">{item.note}</p>
              </div>
            ))}
          </div>
        </Surface>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Surface className="p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-base-content/50">Portfolio Kontrak</p>
          <h3 className="mt-1 text-lg font-bold text-base-content">High-impact Quest, Repeat Giver Rate, dan Value Delivered</h3>
          <div className="mt-3 space-y-2.5">
            {portfolioContracts.map((item) => (
              <div key={item.id} className="rounded-[10px] border border-base-300/60 bg-base-100 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.06em] text-base-content/55">{item.id}</p>
                    <p className="text-sm font-bold text-base-content">{item.title}</p>
                  </div>
                  <span className={cn("rounded-[8px] px-2 py-0.5 text-[11px] font-semibold", contractStatusClass(item.status))}>{item.status}</span>
                </div>
                <p className="mt-1 text-xs text-base-content/65">{item.mode} • {item.role}</p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-[8px] bg-base-200 px-2.5 py-1.5 font-semibold text-base-content/75">Value {item.valueDelivered}</div>
                  <div className="rounded-[8px] bg-base-200 px-2.5 py-1.5 font-semibold text-base-content/75">Repeat {item.repeatGiverRate}</div>
                </div>
                <p className="mt-2 text-xs text-base-content/65">{item.impact}</p>
              </div>
            ))}
          </div>
        </Surface>

        <Surface className="p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-base-content/50">Reliability Trend</p>
          <h3 className="mt-1 text-lg font-bold text-base-content">On-time, Cancel, Dispute (7D vs 30D)</h3>
          <div className="mt-3 space-y-2.5">
            {reliabilityTrends.map((item) => {
              const isGood = item.preferred === "high" ? item.d7 >= item.d30 : item.d7 <= item.d30;
              const trendLabel = isGood ? "Membaik" : "Perlu perhatian";
              return (
                <div key={item.metric} className="rounded-[10px] border border-base-300/60 bg-base-100 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-base-content">{item.metric}</p>
                    <span className={cn("rounded-[8px] px-2 py-0.5 text-[11px] font-semibold", reliabilityTrendClass(isGood))}>{trendLabel}</span>
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                    <div className="rounded-[8px] bg-base-200 px-2 py-1.5 font-semibold text-base-content/75">7D {formatReliabilityValue(item.d7, item.unit)}</div>
                    <div className="rounded-[8px] bg-base-200 px-2 py-1.5 font-semibold text-base-content/75">30D {formatReliabilityValue(item.d30, item.unit)}</div>
                    <div className="rounded-[8px] bg-base-200 px-2 py-1.5 font-semibold text-base-content/75">Target {formatReliabilityValue(item.target, item.unit)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Surface>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Surface className="p-4 sm:p-5 flex flex-col">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-base-content/50">Economic Impact</p>
            <button onClick={() => setSubView({ view: "KycSettlement" })} type="button" className="btn btn-xs h-7 min-h-7 border-none bg-success px-4 text-[10px] font-bold text-white shadow hover:opacity-90">Tarik Saldo</button>
          </div>
          <h3 className="mt-1 text-lg font-bold text-base-content">Dampak Ekonomi dari Aktivitas QQM</h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {economicImpactItems.map((item) => (
              <div key={item.label} className="rounded-[10px] border border-base-300/70 bg-base-100 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-base-content/55">{item.label}</p>
                <p className="mt-1 text-lg font-bold text-base-content">{item.value}</p>
                <span className={cn("mt-2 inline-flex rounded-[8px] px-2 py-0.5 text-[11px] font-semibold text-black", item.tone)}>{item.hint}</span>
              </div>
            ))}
          </div>
        </Surface>

        <Surface className="p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-base-content/50">Pengaturan Akun</p>
              <h3 className="mt-1 text-lg font-bold text-base-content">Umum, Notifikasi, Personalisasi, Kontrol Data, Security</h3>
            </div>
            <span className="rounded-[8px] bg-base-200 px-2.5 py-1 text-xs font-semibold text-base-content/70">
              Aktivasi {settingCompletion}%
            </span>
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {(Object.keys(profileSettings) as SettingTabKey[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveSettingTab(tab)}
                className={cn(
                  "btn h-8 min-h-8 rounded-[999px] border-none px-3 text-xs shadow-none",
                  activeSettingTab === tab ? "bg-primary text-primary-content" : "bg-base-200 text-base-content/75 hover:bg-base-300"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="mt-3 space-y-2">
            {activeSettings.map((item) => (
              <label key={item.id} className="flex items-start gap-3 rounded-[10px] border border-base-300/70 bg-base-100 p-3">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm mt-0.5"
                  checked={settingState[item.id]}
                  onChange={() => toggleSetting(item.id)}
                />
                <div>
                  <p className="text-sm font-semibold text-base-content">
                    {item.label}{" "}
                    {item.critical ? (
                      <span className="rounded-[6px] bg-[#FEE2E2] px-1.5 py-0.5 text-[10px] font-bold text-[#991B1B]">Critical</span>
                    ) : null}
                  </p>
                  <p className="text-xs text-base-content/65">{item.description}</p>
                </div>
              </label>
            ))}
          </div>
        </Surface>
      </div>
      <Surface className="p-4 sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-base-content/50">PP Breakdown</p>
        <h3 className="mt-1 text-lg font-bold text-base-content">Distribusi Performance Point per Skill</h3>
        <div className="mt-3 grid gap-3">
          {profileSkillBreakdown.map((item) => (
            <div key={item.skill} className="rounded-[10px] border border-base-300/60 bg-base-100 px-3 py-2.5">
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <p className="text-sm font-bold text-base-content">{item.skill}</p>
                <span className="text-xs font-semibold text-base-content/65">{item.pp}</span>
              </div>
              <div className="h-2 rounded-full bg-base-200">
                <div className={cn("h-2 rounded-full", item.toneClass)} style={{ width: `${item.share}%` }} />
              </div>
              <div className="mt-1.5 flex items-center justify-between text-xs font-medium text-base-content/65">
                <span>Kontribusi {item.share}%</span>
                <span>{item.trend}</span>
              </div>
            </div>
          ))}
        </div>
      </Surface>
    </div>
  );
}

function ProfileComponent({ profile, compact = false, className = "", showMeta = true }: ProfileProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-[12px] border border-base-300/70 bg-base-100/95 shadow-[0_6px_18px_rgba(15,23,42,0.07)] backdrop-blur",
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

